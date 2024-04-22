import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Roboto Mono",
  src: "https://fonts.gstatic.com/s/robotomono/v4/hMqPNLsu_dywMa4C_DEpY50EAVxt0G0biEntp43Qt6E.ttf",
});

interface PDFProps {
  title: string;
  tab: string;
}

export default function PDFTab({ title, tab }: PDFProps): JSX.Element {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#E4E4E4",
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 20,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    title: {
      fontSize: 24,
      textAlign: "center",
    },
    tab: {
      paddingTop: 10,
      fontSize: 7,
      fontFamily: "Roboto Mono",
      textAlign: "center",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.tab}>{tab}</Text>
        </View>
      </Page>
    </Document>
  );
}
