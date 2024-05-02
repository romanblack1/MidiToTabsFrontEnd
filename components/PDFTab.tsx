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
      paddingBottom: 35,
      paddingHorizontal: 20,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center", // Centers the child components (title and tab section)
    },
    title: {
      fontSize: 24,
      textAlign: "center",
      marginBottom: 15,
    },
    tabContainer: {
      width: "85%", // Control this percentage to adjust the width of the tab block
      textAlign: "left", // Ensures text within the tab container is aligned left
      marginLeft: "auto", // These two auto margins center the container
      marginRight: "auto",
    },
    tabText: {
      fontSize: 7,
      fontFamily: "Roboto Mono",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.tabContainer}>
            <Text style={styles.tabText}>{tab}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
