import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function animedetailsscreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Anime Details</Text>

      {/* Add main anime image below */}
      {/* <Image source={{ uri: 'IMAGE_URL_HERE' }} style={styles.image} /> */}

      <Text style={styles.animeTitle}>Demon Slayer</Text>

      <View style={styles.ratingRow}>
        <FontAwesome name="star" size={20} color="black" />
        <Text style={styles.ratingText}>4.8 Action</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Description</Text>
      </TouchableOpacity>

      <Text style={styles.subHeading}>You might also Like</Text>

      <View style={styles.recommendationRow}>
        {/* Add recommendation images below */}
        {/* <Image source={{ uri: 'RECOMMENDATION_IMAGE_1' }} style={styles.recommendationImage} /> */}
        {/* <Image source={{ uri: 'RECOMMENDATION_IMAGE_2' }} style={styles.recommendationImage} /> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  animeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 5,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  recommendationRow: {
    flexDirection: 'row',
    gap: 10,
  },
  recommendationImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});
