import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import {
  Card,
  Paragraph,
  Provider as PaperProvider,
  TextInput,
  Button,
} from 'react-native-paper';

const ThingSpeakDataDisplay = () => {
  const [sensorData, setSensorData] = useState();
  const [connectionStatus, setStatus] = useState();
  const [maxLevel, setMaxLevel] = useState('');
  const [minLevel, setMinLevel] = useState('');
  const [height, setheight] = useState('');

  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchData();
    fetchConnection();
    const interval = setInterval(() => {
      fetchData();
      fetchConnection();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sensorData !== undefined && maxLevel !== '' && minLevel !== '') {
      if (sensorData > maxLevel) {
        setAlertMessage(
          `Warning: Sensor reading (${sensorData}) is above the maximum level (${maxLevel})!`,
        );
      } else if (sensorData < minLevel) {
        setAlertMessage(
          `Warning: Sensor reading (${sensorData}) is below the minimum level (${minLevel})!`,
        );
      } else {
        setAlertMessage('');
      }
    }
  }, [sensorData, maxLevel, minLevel]);

  const fetchData = async () => {
    const url = `https://level-sensor-1663d-default-rtdb.asia-southeast1.firebasedatabase.app/readings.json`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSensorData(data.value);
    } catch (error) {
      console.error('Failed to fetch data from ThingSpeak:', error);
    }
  };

  const fetchConnection = async () => {
    const url = `https://level-sensor-1663d-default-rtdb.asia-southeast1.firebasedatabase.app/on_status.json`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setStatus(data.on_status);
    } catch (error) {
      console.error('Failed to fetch data from ThingSpeak:', error);
    }
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Card key={1} style={styles.card}>
          <Card.Content>
            <Paragraph style={styles.txt}>
              Battery Percentage: {connectionStatus || 'N/A'}
            </Paragraph>
            <Paragraph style={styles.txt}>
              Readings: {sensorData || 'N/A'}
            </Paragraph>
            <Card key={5} style={styles.card2}>
              <TextInput
                label="Height"
                value={height}
                onChangeText={setheight}
                keyboardType="numeric"
              />
              <Button>save</Button>
              <Button>Reset</Button>
            </Card>
            <Card key={2} style={styles.card2}>
              <TextInput
                label="Max Level"
                value={maxLevel}
                onChangeText={setMaxLevel}
                keyboardType="numeric"
              />
              <Button>save</Button>
              <Button>Reset</Button>
            </Card>
            <Card key={3} style={styles.card2}>
              <TextInput
                label="Min Level"
                value={minLevel}
                onChangeText={setMinLevel}
                keyboardType="numeric"
              />
              <Button>save</Button>
              <Button>Reset</Button>
            </Card>

            {alertMessage ? (
              <View style={styles.alertContainer}>
                <Text style={styles.alertText}>{alertMessage}</Text>
              </View>
            ) : null}
            <Paragraph>Sensor ID: {1}</Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  txt: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  card2: {
    marginHorizontal: 20,
    marginVertical: 10,
    elevation: 2,
  },
  alertContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'red',
  },
  alertText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ThingSpeakDataDisplay;
