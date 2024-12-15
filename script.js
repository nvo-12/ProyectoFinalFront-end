// URL de la API
const API_URL = 'https://dog.ceo/api/breeds/list/all';

// Categorías de tamaños
const SIZE_CATEGORIES = {
    small: [
        'chihuahua', 'pomeranian', 'yorkshire', 'maltese',  
        'boston terrier', 'miniature pinscher', 'toy poodle'
    ],
    medium: [
        'beagle', 'bulldog', 'corgi', 'shiba inu', 'border collie', 
        'whippet', 'australian shepherd', 'standard schnauzer'
    ],
    large: [
        'german shepherd', 'golden retriever', 'labrador retriever', 
        'rottweiler', 'doberman', 'bernese mountain dog', 'great dane', 'siberian husky'
    ]
};

// Función para obtener la lista de razas
async function fetchDogBreeds() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status}`);
        }
        const data = await response.json();
        return Object.keys(data.message);
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Función para obtener una imagen de una raza específica
async function fetchDogImage(breed) {
    const imageURL = `https://dog.ceo/api/breed/${breed}/images/random`;
    try {
        const response = await fetch(imageURL);
        if (!response.ok) {
            throw new Error(`Error al obtener la imagen para la raza ${breed}`);
        }
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Función para clasificar las razas según el tamaño
function classifyBreeds(breeds) {
    const classified = {
        small: [],
        medium: [],
        large: []
    };

    breeds.forEach(breed => {
        if (SIZE_CATEGORIES.small.includes(breed)) {
            classified.small.push(breed);
        } else if (SIZE_CATEGORIES.medium.includes(breed)) {
            classified.medium.push(breed);
        } else if (SIZE_CATEGORIES.large.includes(breed)) {
            classified.large.push(breed);
        }
    });

    return classified;
}