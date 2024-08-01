import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Card,
  Paragraph,
  Provider as PaperProvider,
  TextInput,
  Button,
} from 'react-native-paper';

const ThingSpeakDataDisplay = () => {
  const [sensorData, setSensorData] = useState(0);
  const [connectionStatus, setStatus] = useState('');
  const [sensorData2, setSensorData2] = useState(0);
  const [connectionStatus2, setStatus2] = useState('');
  const [maxLevel, setMaxLevel] = useState('');
  const [minLevel, setMinLevel] = useState('');
  const [height, setHeight] = useState('');
  const [maxLevel2, setMaxLevel2] = useState('');
  const [minLevel2, setMinLevel2] = useState('');
  const [height2, setHeight2] = useState('');

  const [alertMessage, setAlertMessage] = useState('');
  const [alertMessage2, setAlertMessage2] = useState('');

  useEffect(() => {
    loadData();
    fetchData1();
    fetchConnection1();
    fetchData2();
    fetchConnection2();
    const interval = setInterval(() => {
      fetchData1();
      fetchConnection1();
      fetchData2();
      fetchConnection2();
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
  useEffect(() => {
    if (sensorData2 !== undefined && maxLevel2 !== '' && minLevel2 !== '') {
      if (sensorData2 > maxLevel2) {
        setAlertMessage2(
          `Warning: Sensor reading (${sensorData2}) is above the maximum level (${maxLevel2})!`,
        );
      } else if (sensorData2 < minLevel2) {
        setAlertMessage2(
          `Warning: Sensor reading (${sensorData2}) is below the minimum level (${minLevel2})!`,
        );
      } else {
        setAlertMessage2('');
      }
    }
  }, [sensorData2, maxLevel2, minLevel2]);

  const loadData = async () => {
    try {
      const storedHeight = await AsyncStorage.getItem('height');
      const storedMaxLevel = await AsyncStorage.getItem('maxLevel');
      const storedMinLevel = await AsyncStorage.getItem('minLevel');
      const storedHeight2 = await AsyncStorage.getItem('height2');
      const storedMaxLevel2 = await AsyncStorage.getItem('maxLevel2');
      const storedMinLevel2 = await AsyncStorage.getItem('minLevel2');
      if (storedHeight !== null) setHeight(storedHeight);
      if (storedMaxLevel !== null) setMaxLevel(storedMaxLevel);
      if (storedMinLevel !== null) setMinLevel(storedMinLevel);
      if (storedHeight2 !== null) setHeight2(storedHeight2);
      if (storedMaxLevel2 !== null) setMaxLevel2(storedMaxLevel2);
      if (storedMinLevel2 !== null) setMinLevel2(storedMinLevel2);
    } catch (error) {
      console.error('Failed to load data from local storage:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('height', height);
      await AsyncStorage.setItem('maxLevel', maxLevel);
      await AsyncStorage.setItem('minLevel', minLevel);
      await AsyncStorage.setItem('height2', height2);
      await AsyncStorage.setItem('maxLevel2', maxLevel2);
      await AsyncStorage.setItem('minLevel2', minLevel2);
    } catch (error) {
      console.error('Failed to save data to local storage:', error);
    }
  };

  const resetData = async () => {
    setHeight('');
    setMaxLevel('');
    setMinLevel('');

    try {
      await AsyncStorage.removeItem('height');
      await AsyncStorage.removeItem('maxLevel');
      await AsyncStorage.removeItem('minLevel');
    } catch (error) {
      console.error('Failed to reset data in local storage:', error);
    }
  };
  const resetData2 = async () => {
    setHeight2('');
    setMaxLevel2('');
    setMinLevel2('');

    try {
      await AsyncStorage.removeItem('height2');
      await AsyncStorage.removeItem('maxLevel2');
      await AsyncStorage.removeItem('minLevel2');
    } catch (error) {
      console.error('Failed to reset data in local storage:', error);
    }
  };

  const fetchData2 = async () => {
    const url = `https://level-sensor-1663d-default-rtdb.asia-southeast1.firebasedatabase.app/sensor_2/readings.json`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSensorData2(data.value);
    } catch (error) {
      console.error('Failed to fetch data from ThingSpeak:', error);
    }
  };

  const fetchConnection2 = async () => {
    const url = `https://level-sensor-1663d-default-rtdb.asia-southeast1.firebasedatabase.app/sensor_2/on_status.json`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setStatus2(data.on_status);
    } catch (error) {
      console.error('Failed to fetch data from ThingSpeak:', error);
    }
  };
  const fetchData1 = async () => {
    const url = `https://level-sensor-1663d-default-rtdb.asia-southeast1.firebasedatabase.app/sensor_1/readings.json`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSensorData(data.value);
    } catch (error) {
      console.error('Failed to fetch data from ThingSpeak:', error);
    }
  };

  const fetchConnection1 = async () => {
    const url = `https://level-sensor-1663d-default-rtdb.asia-southeast1.firebasedatabase.app/sensor_1/on_status.json`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setStatus(data.on_status);
    } catch (error) {
      console.error('Failed to fetch data from ThingSpeak:', error);
    }
  };

  const calculatedReading = height ? height - sensorData : 'N/A';
  const calculatedReading2 = height2 ? height2 - sensorData2 : 'N/A';

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Card key={1} style={styles.card}>
          <Card.Content>
            <Paragraph style={styles.txt}>
              Battery Percentage: {connectionStatus || 'N/A'}
            </Paragraph>
            <Paragraph style={styles.txt}>
              Readings: {calculatedReading}
            </Paragraph>
            <Card key={5} style={styles.card2}>
              <TextInput
                label="Height"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
              <Button onPress={saveData}>Save</Button>
              <Button onPress={resetData}>Reset</Button>
            </Card>
            <Card key={2} style={styles.card2}>
              <TextInput
                label="Max Level"
                value={maxLevel}
                onChangeText={setMaxLevel}
                keyboardType="numeric"
              />
              <Button onPress={saveData}>Save</Button>
              <Button onPress={resetData}>Reset</Button>
            </Card>
            <Card key={3} style={styles.card2}>
              <TextInput
                label="Min Level"
                value={minLevel}
                onChangeText={setMinLevel}
                keyboardType="numeric"
              />
              <Button onPress={saveData}>Save</Button>
              <Button onPress={resetData}>Reset</Button>
            </Card>

            {alertMessage ? (
              <View style={styles.alertContainer}>
                <Text style={styles.alertText}>{alertMessage}</Text>
              </View>
            ) : null}
            <Paragraph>Sensor ID: {1}</Paragraph>
          </Card.Content>
        </Card>
        <Card key={2} style={styles.card}>
          <Card.Content>
            <Paragraph style={styles.txt}>
              Battery Percentage: {connectionStatus2 || 'N/A'}
            </Paragraph>
            <Paragraph style={styles.txt}>
              Readings: {calculatedReading2}
            </Paragraph>
            <Card key={5} style={styles.card2}>
              <TextInput
                label="Height"
                value={height2}
                onChangeText={setHeight2}
                keyboardType="numeric"
              />
              <Button onPress={saveData}>Save</Button>
              <Button onPress={resetData2}>Reset</Button>
            </Card>
            <Card key={2} style={styles.card2}>
              <TextInput
                label="Max Level"
                value={maxLevel2}
                onChangeText={setMaxLevel2}
                keyboardType="numeric"
              />
              <Button onPress={saveData}>Save</Button>
              <Button onPress={resetData}>Reset</Button>
            </Card>
            <Card key={3} style={styles.card2}>
              <TextInput
                label="Min Level"
                value={minLevel2}
                onChangeText={setMinLevel2}
                keyboardType="numeric"
              />
              <Button onPress={saveData}>Save</Button>
              <Button onPress={resetData}>Reset</Button>
            </Card>

            {alertMessage2 ? (
              <View style={styles.alertContainer}>
                <Text style={styles.alertText}>{alertMessage2}</Text>
              </View>
            ) : null}
            <Paragraph>Sensor ID: {2}</Paragraph>
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
