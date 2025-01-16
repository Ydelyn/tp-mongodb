import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

type WeatherData = {
    city: string;
    weather: {
        temperature: number;
        wind_speed: number;
        weathercode: number;
    };
};

export const WeatherDisplay = () => {
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const cities = [
        'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes',
        'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims',
        'Le Havre', 'Saint-Étienne', 'Toulon', 'Angers', 'Grenoble', 'Dijon',
        'Nîmes', 'Villeurbanne', 'Clermont-Ferrand', 'Aix-en-Provence',
        'Brest', 'Limoges', 'Tours', 'Amiens', 'Perpignan', 'Metz', 'Besançon',
        'Boulogne-Billancourt', 'Argenteuil', 'Montreuil', 'Nancy', 'Rouen',
        'Mulhouse', 'Caen', 'Saint-Denis', 'Roubaix', 'Tourcoing', 'Nanterre',
      ];

    const getCoordinates = async (city: string) => {
        try {
            const response = await axios.get(
                `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
        )   ;
            const { latitude, longitude } = response.data.results[0];
            return { latitude, longitude };
        } catch (error) {
            console.error(`Erreur lors de la récupération des coordonnées pour ${city}:`, error);
            return null;
        }          
    };

    const getWeather = async (latitude: number, longitude: number) => {
        try {
          const response = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          );
          return response.data.current_weather;
        } catch (error) {
          console.error(`Erreur lors de la récupération de la météo:`, error);
          return null;
        }
    };

    const getWeatherDescription = (weatherCode: number) => {
        const weatherDescriptions: { [key: number]: string } = {
          0: 'Ciel clair',
          1: 'Partiellement nuageux',
          2: 'Partiellement nuageux',
          3: 'Partiellement nuageux',
          45: 'Brouillard',
          48: 'Brouillard',
          51: 'Bruine légère',
          53: 'Bruine modérée',
          55: 'Bruine dense',
          61: 'Pluie légère',
          63: 'Pluie modérée',
          65: 'Pluie forte',
          71: 'Neige légère',
          73: 'Neige modérée',
          75: 'Neige forte',
          95: 'Orage',
        };
    
        return weatherDescriptions[weatherCode] || 'Conditions inconnues';
      };

    useEffect(() => {
        const fetchWeather = async () => {
            const data: WeatherData[] = [];
            for (const city of cities) {
              const coordinates = await getCoordinates(city);
              if (coordinates) {
                const weather = await getWeather(coordinates.latitude, coordinates.longitude);
                data.push({ city, weather });
              }
            }
            setWeatherData(data);
          };
    
        fetchWeather();
      }, []);

    return (
        <View style={styles.container}>
        <FlatList
          data={weatherData}
          keyExtractor={(item) => item.city}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.city}>{item.city}</Text>
              <Text style={styles.weather}>{item.weather.temperature}°C | {getWeatherDescription(item.weather.weathercode)}</Text>
            </View>
          )}
        />
      </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    item: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    city: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    weather: {
      fontSize: 16,
      color: '#555',
    },
  });

  export default WeatherDisplay;
  