import sys
import os
import mido
from mido import MidiFile
from dataclasses import dataclass
from constraint import *
import copy


@dataclass
class Note:
    name: str
    note: int
    on: bool
    velocity: int
    channel: int
    time: int
    quarter_beat_index: int


@dataclass
class PairedNote:
    note_on: Note
    note_off: Note


@dataclass
class GuitarNote:
    string_name: str
    string_index: int  # number 0-5, 0 representing the high e string
    fret: int
    start_time: int = 0
    quarter_beat_index: int = 0


@dataclass
class Tab:
    guitar_note_list: list


# def print_note_range(paired_notes):
#     paired_notes = sorted(paired_notes, key=lambda x: x[0].note)
#     print("Min Note: " + str(paired_notes[0][0].note) + ". Max Note: " + str(paired_notes[-1][0].note))


# Given tuning and capo offsets, create a dictionary of notes to fret-string combos
def create_guitar_index(tuning_offset, capo_offset):
    e_string = (64 + capo_offset, 81)
    b_string = (59 + capo_offset, 76)
    g_string = (55 + capo_offset, 72)
    d_string = (50 + capo_offset, 67)
    a_string = (45 + capo_offset, 62)
    low_e_string = (40 + capo_offset + tuning_offset, 57 + tuning_offset)

    note_names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    low_e_string_name = note_names[((40 + tuning_offset) % 12)]

    guitar_index = {}
    for note_num in range(40 + capo_offset + tuning_offset, 82):
        string_fret_combo = []
        if e_string[0] <= note_num <= e_string[1]:
            string_fret_combo.append(GuitarNote("e", 0, note_num - e_string[0]))
        if b_string[0] <= note_num <= b_string[1]:
            string_fret_combo.append(GuitarNote("B", 1, note_num - b_string[0]))
        if g_string[0] <= note_num <= g_string[1]:
            string_fret_combo.append(GuitarNote("G", 2, note_num - g_string[0]))
        if d_string[0] <= note_num <= d_string[1]:
            string_fret_combo.append(GuitarNote("D", 3, note_num - d_string[0]))
        if a_string[0] <= note_num <= a_string[1]:
            string_fret_combo.append(GuitarNote("A", 4, note_num - a_string[0]))
        if low_e_string[0] <= note_num <= low_e_string[1]:
            string_fret_combo.append(GuitarNote(low_e_string_name, 5, note_num - low_e_string[0]))

        guitar_index[note_num] = string_fret_combo

    return guitar_index, (40 + capo_offset + tuning_offset, 81)


# Captures important info from midi song
def create_time_info_dict(midi_song):
    # Figure out the midi tick to seconds ratio
    time_info_dict = {}
    tempo = 500000
    time_sig_numerator = 4
    time_sig_denominator = 4
    found_tempo = False
    found_numerator = False
    for message in midi_song.tracks[0]:
        if type(message) == mido.midifiles.meta.MetaMessage:
            if message.type == 'set_tempo':
                tempo = message.tempo
                found_tempo = True
                if found_tempo and found_numerator:
                    break
            if message.type == 'time_signature':
                time_sig_numerator = message.numerator
                time_sig_denominator = message.denominator
                found_numerator = True
                if found_tempo and found_numerator:
                    break
    ticks_to_seconds_ratio = tempo / 1000000 / midi_song.ticks_per_beat
    seconds_per_beat = midi_song.ticks_per_beat * ticks_to_seconds_ratio
    time_info_dict["tempos"] = []
    time_info_dict["ticks_per_beat"] = midi_song.ticks_per_beat
    time_info_dict["time_sig_numerator"] = time_sig_numerator
    time_info_dict["time_sig_denominator"] = time_sig_denominator
    time_info_dict["ticks_to_seconds_ratio"] = ticks_to_seconds_ratio
    time_info_dict["seconds_per_beat"] = seconds_per_beat

    return time_info_dict


# Clears the given directory from path of all files
def clear_directory(path):
    for filename in os.listdir(path):
        file_path = os.path.join(path, filename)
        if os.path.isfile(file_path):
            os.remove(file_path)


# Splits a given midi song into midi files containing each
# track separately, saves them in the given destination
def song_to_tracks(song: MidiFile, destination_dir: str, ticks_per_beat):
    # Clearing Destination of Midi Files
    clear_directory(destination_dir)

    # Splitting Tracks and Writing Files to destination_dir
    important_meta_messages = []
    channels_dict = {}
    for track_index in range(len(song.tracks)):
        total_time = 0
        for message in song.tracks[track_index]:
            total_time += message.time

            # hard coding place to find important meta messages,
            # add specific meta messages to all tracks so that they play the correct tempo/key/etc.
            if track_index == 0 and type(message) == mido.midifiles.meta.MetaMessage:
                if message.type == 'key_signature' or \
                        message.type == 'time_signature' or \
                        message.type == 'smpte_offset' or \
                        message.type == 'set_tempo':
                    important_meta_messages.append(message)
            elif type(message) == mido.messages.messages.Message and message.type != 'sysex':
                try:
                    channels_dict.setdefault(message.channel, (important_meta_messages.copy(), 0))
                    message.time = total_time - channels_dict[message.channel][1]
                    channels_dict[message.channel][0].append(message)
                    channels_dict[message.channel] = (channels_dict[message.channel][0], total_time)
                except Exception as e:
                    print(message)
                    print(e)
    for channel in channels_dict:
        temp_song = MidiFile()
        temp_song.tracks.append(important_meta_messages + channels_dict[channel][0])
        temp_song.ticks_per_beat = ticks_per_beat
        temp_song.save(f'SplitTrackDepot\\{channel}.mid')

    longest_channel = max(channels_dict, key=lambda channel_index: len(channels_dict[channel_index][0]))
    return longest_channel


# Translates from MIDI note number (0-128) to name with octave and number
def note_number_to_name(note_number):
    # Define a list of note names
    note_names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    # Calculate the octave and note index
    octave = note_number // 12
    note_index = note_number % 12
    # Get the note name based on the note index
    note_name = note_names[note_index]
    return f"{note_name}{octave}"


# Create notes from the given track
def create_notes(single_track, time_info_dict, guitar_range):
    notes_on = []
    notes_off = []
    time_counter = 0
    time_seconds = 0
    for message in single_track:
        try:
            if type(message) == mido.midifiles.meta.MetaMessage and message.type == "set_tempo":
                pass
            else:
                time_counter += message.time

            if len(time_info_dict["tempos"]) > 0 and time_counter >= time_info_dict["tempos"][0][1]:
                new_tempo = time_info_dict["tempos"].pop()[0]
                time_info_dict["ticks_to_seconds_ratio"] = \
                    new_tempo / 1000000 / time_info_dict["ticks_per_beat"]
                time_info_dict["seconds_per_beat"] = \
                    time_info_dict["ticks_per_beat"] * time_info_dict["ticks_to_seconds_ratio"]
            # Calculate the correct time in seconds by doing MIDI Ticks * (Tempo / PPQ)
            # In this case, we have tempo in microseconds, so we divide by 1000000
            # to get tempo in seconds. 480 PPQ is found in the header of the MidiFile
            # "ticks_per_beat" and tempo is found in a MetaMessage in the track
            # named 'set_tempo' as the value tempo
            time_seconds = time_counter * time_info_dict["ticks_to_seconds_ratio"]
        except Exception as e:
            print("Message without time:" + str(message) + str(e))
        if type(message) == mido.midifiles.meta.MetaMessage:
            if message.type == "set_tempo":
                time_info_dict["tempos"].append((message.tempo, message.time))
            continue
        if message.type == "note_on":
            if message.note not in range(*guitar_range):
                continue
            temp_note = Note(note_number_to_name(message.note), message.note,
                             True, message.velocity, message.channel, time_seconds,
                             1 + round(4*time_seconds/time_info_dict["seconds_per_beat"]))
            notes_on.append(temp_note)
        elif message.type == "note_off":
            if message.note not in range(*guitar_range):
                continue
            temp_note = Note(note_number_to_name(message.note), message.note,
                             False, message.velocity, message.channel, time_seconds,
                             1 + round(4*time_seconds/time_info_dict["seconds_per_beat"]))
            notes_off.append(temp_note)
        else:
            pass  # print("Not a Note!")
    return notes_on, notes_off


# Pairs up a note's on and off messages (represented as note
# objects) into a singular tuple with the on note first and
# the off note second
def pair_up_notes(notes_on, notes_off):
    notes_on = sorted(notes_on, key=lambda note: note.name)
    notes_off = sorted(notes_off, key=lambda note: note.name)
    paired_notes = []
    if len(notes_on) == len(notes_off):
        for x in range(len(notes_on)):
            paired_notes.append(PairedNote(notes_on[x], notes_off[x]))
    return paired_notes


# Pick the solution with the lowest avg string value
def pick_min_string_index(solutions):
    min_solution = solutions[0]

    min_avg_string_index = 6
    for solution in solutions:
        sum_string_index = 0
        for dict_val in solution.values():
            sum_string_index += dict_val.string_index
        avg_string_index = sum_string_index / len(solution)
        if avg_string_index < min_avg_string_index:
            min_solution = solution
            min_avg_string_index = avg_string_index

    return min_solution


# Checks for bars that are unplayable and removes them from the solution set
def remove_unplayable_bars(solutions):
    vetted_solutions = []

    for solution in solutions:
        fret_nums = []
        for guitar_note in solution.values():
            if guitar_note.fret != 0:
                fret_nums.append(guitar_note.fret)
        if len(fret_nums) <= 4:
            vetted_solutions.append(solution)
            continue
        necessary_bar_len = 2 if len(fret_nums) == 5 else 3
        for x in range(1, 15):
            if fret_nums.count(x) >= necessary_bar_len:
                vetted_solutions.append(solution)
                break
            elif fret_nums.count(x) == 1:
                break

    return vetted_solutions


# Given notes to be played simultaneously, chooses the best fingering for them to be played
def optimize_simultaneous_notes(simultaneous_notes, guitar_index):
    problem = Problem()

    variables = []
    for paired_note in simultaneous_notes:
        if str(paired_note.note_on.note) not in variables:
            variables.append(str(paired_note.note_on.note))
            potential_guitar_notes = copy.deepcopy(guitar_index[paired_note.note_on.note])
            for guitar_note in potential_guitar_notes:
                guitar_note.quarter_beat_index = paired_note.note_on.quarter_beat_index
            problem.addVariable(str(paired_note.note_on.note), potential_guitar_notes)

    for i in range(len(variables)):
        for j in range(i + 1, len(variables)):
            # Add a constraint function that checks if the absolute difference is <= 4
            def fret_constraint_function(a, b):
                return abs(a.fret - b.fret) <= 4 or \
                       (a.fret == 0 and abs(a.fret - b.fret) <= 7) or \
                       (b.fret == 0 and abs(a.fret - b.fret) <= 7)

            # Add a constraint function that checks if the strings are different
            def string_constraint_function(a, b):
                return a.string_index != b.string_index

            # Add the constraints to the problem
            problem.addConstraint(fret_constraint_function, (variables[i], variables[j]))
            problem.addConstraint(string_constraint_function, (variables[i], variables[j]))

    solutions = problem.getSolutions()
    if len(solutions) == 0:
        simultaneous_notes.pop(1)
        return optimize_simultaneous_notes(simultaneous_notes, guitar_index)

    best_solution = pick_min_string_index(solutions)

    solutions = remove_unplayable_bars(solutions)

    if solutions:
        best_solution = pick_min_string_index(solutions)

    return best_solution


# Returns a Tab that has the chosen way to play all notes
def translate_notes(paired_notes, guitar_index):
    guitar_note_list = []
    paired_notes = sorted(paired_notes, key=lambda x: x.note_on.time)
    paired_note_index = 0
    while paired_note_index < len(paired_notes):
        current_note = paired_notes[paired_note_index]

        i = 1
        current_quarter_beat_index = current_note.note_on.quarter_beat_index
        simultaneous_notes = [current_note]
        while paired_note_index + i < len(paired_notes) and \
                current_quarter_beat_index == paired_notes[paired_note_index + i].note_on.quarter_beat_index:
            simultaneous_notes.append(paired_notes[paired_note_index + i])
            i += 1
        paired_note_index += i

        if len(simultaneous_notes) == 1:
            guitar_note = guitar_index[current_note.note_on.note][0]
            guitar_note_list.append(GuitarNote(guitar_note.string_name, guitar_note.string_index, guitar_note.fret,
                                               current_note.note_on.time, current_note.note_on.quarter_beat_index))

        else:
            playable_notes = optimize_simultaneous_notes(simultaneous_notes, guitar_index)
            guitar_note_list.extend(playable_notes.values())

    return Tab(guitar_note_list)


# Print one line of the tab
def print_tab_line(guitar_strings):
    for guitar_string in guitar_strings:
        print(guitar_string)
    print()


# Given the Tab with the chosen notes, creates the human-readable tab and prints it
def print_tab(tab, time_sig_numerator, time_sig_denominator, tuning_offset):
    note_names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    low_e_string_name = note_names[((40 + tuning_offset) % 12)]

    empty_guitar_strings = ["e|", "B|", "G|", "D|", "A|", low_e_string_name + "|"] \
        if len(low_e_string_name) == 1 \
        else ["e |", "B |", "G |", "D |", "A |", low_e_string_name + "|"]
    guitar_strings = empty_guitar_strings.copy()

    quarter_beats_per_measure = time_sig_numerator * time_sig_denominator
    last_beat_index = tab.guitar_note_list[-1].quarter_beat_index
    song_len = last_beat_index + quarter_beats_per_measure - (last_beat_index % quarter_beats_per_measure) + 1
    note_index = 0
    for time_index in range(1, song_len):
        # to account for fret nums > 2 characters long (10-17), and no notes at this time tick
        max_string_len = len(guitar_strings[0]) + 1
        current_guitar_note = tab.guitar_note_list[note_index] if note_index < len(tab.guitar_note_list) else None
        while current_guitar_note and current_guitar_note.quarter_beat_index == time_index:
            # catches notes on this time tick
            fret = str(current_guitar_note.fret)
            guitar_strings[current_guitar_note.string_index] += fret
            max_string_len = max(max_string_len, len(guitar_strings[current_guitar_note.string_index]))
            note_index += 1
            current_guitar_note = tab.guitar_note_list[note_index] if note_index < len(tab.guitar_note_list) else None

        for guitar_string_index in range(len(guitar_strings)):
            # add dashes to strings that don't have notes at this time tick
            if len(guitar_strings[guitar_string_index]) < max_string_len:
                num_dashes = (max_string_len - len(guitar_strings[guitar_string_index]))
                guitar_strings[guitar_string_index] += ("-" * num_dashes)

        if time_index > 0 and time_index % quarter_beats_per_measure == 0:
            for guitar_string_index in range(len(guitar_strings)):
                guitar_strings[guitar_string_index] += "|"
        if time_index > 0 and time_index % (quarter_beats_per_measure * 8) == 0:
            print_tab_line(guitar_strings)
            guitar_strings = empty_guitar_strings.copy()

    if len(guitar_strings[0]) > 3:
        print_tab_line(guitar_strings)


def main(midi_file, channel_num, tuning_offset, capo_offset):
    # Create guitar index with note keys -- fret-string values
    guitar_index, guitar_range = create_guitar_index(tuning_offset, capo_offset)

    # Read in the song
    midi_song = MidiFile(midi_file, clip=True)

    # Capture important info from song
    time_info_dict = create_time_info_dict(midi_song)

    # Split song into tracks for single track translation
    longest_channel = song_to_tracks(midi_song, 'SplitTrackDepot', time_info_dict["ticks_per_beat"])
    if channel_num == -1:
        channel_num = longest_channel

    track_file = 'SplitTrackDepot/' + str(channel_num) + '.mid'
    single_track = MidiFile(track_file, clip=True).tracks[0]

    # Read from the single track and put notes into structures
    notes_on, notes_off = create_notes(single_track, time_info_dict, guitar_range)
    paired_notes = pair_up_notes(notes_on, notes_off)

    # Create the list of guitar notes translated from the paired notes we read from the track-file
    guitar_tab = translate_notes(paired_notes, guitar_index)

    # Print the generated tab into expected readable output
    print_tab(guitar_tab, time_info_dict["time_sig_numerator"], time_info_dict["time_sig_denominator"], tuning_offset)

    return


if __name__ == '__main__':
    if len(sys.argv) == 2:
        main(sys.argv[1], -1, 0, 0)
    elif len(sys.argv) == 3:
        main(sys.argv[1], int(sys.argv[2]), 0, 0)
    elif len(sys.argv) == 5:
        main(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]))

    else:
        print("Usages:")
        print("python3 MidiToTabs.py <midi_file>")
        print("python3 MidiToTabs.py <midi_file> <channel_number>")
        print("python3 MidiToTabs.py <midi_file> <channel_number> <tuning_offset> <capo_fret>")
