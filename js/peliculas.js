// Función para crear elementos HTML
const createElement = (tag, className, attributes = {}) => {
    // Creamos un nuevo elemento HTML del tipo especificado (tag)
    const element = document.createElement(tag);
    
    // Si se especificó una clase, la añadimos al elemento
    if (className) {
        element.classList.add(className);
    }
    
    // Iteramos sobre los atributos pasados como argumento y los añadimos al elemento
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    
    // Devolvemos el elemento creado
    return element;
};
let endpoint;
let page = 1
const cardContainer = document.querySelector('.contenedor-cartas')

window.onload = async () => {
    try {
        endpoint = `/movie/popular?page=${page}`
        const data = await fetchData(endpoint)
        const paginas = createElement('small','pages')
        paginas.innerHTML = `Pagina <b>${data.page}</b> de <b>${data.total_pages}</b>, mostrando ${data.results.length} elementos por pagina`
        cardContainer.insertAdjacentElement('beforebegin', paginas)
        data.results.forEach((movie) => {
            const pelicula = createElement('div', 'cardMovie');
            const anchor = createElement('a', '');
            anchor.href = './pages/detalle.html';
            const img = createElement('img', 'imgTendencia', {
                src: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                alt: movie.title,
                loading: 'lazy'
            });
            const tituloPelicula = createElement('div', 'tituloPelicula');
            const titulo = createElement('h4', '');
            titulo.textContent = movie.title;
            tituloPelicula.appendChild(titulo)
            pelicula.append(tituloPelicula,img)

            cardContainer.appendChild(pelicula)
        });
    } catch (err) {
        console.log(err)
        alert('hubo un error en la peticion al API')
    }
}

async function fetchData(endpoint) {
    try {
        const res = await fetch(`https://api.themoviedb.org/3${endpoint}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTJjYTAwZDYxZWIzOTEyYjZlNzc4MDA4YWQ3ZmNjOCIsInN1YiI6IjYyODJmNmYwMTQ5NTY1MDA2NmI1NjlhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4MJSPDJhhpbHHJyNYBtH_uCZh4o0e3xGhZpcBIDy-Y8'
            }
        })
        const data = await res.json()
        return data
    } catch(error) {
        console.log(error)
    }
}

const form = document.querySelector('form')

form.onsubmit = async (e) => {
    e.preventDefault()
    try {
        const query = form.search.value 
        const data = await fetchData(`/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`)
        if (data.results) {
            cardContainer.replaceChildren()
            const paginas = document.querySelector('small.pages')
            paginas.innerHTML = `Pagina <b>${data.page}</b> de <b>${data.total_pages}</b>, mostrando ${data.results.length} elementos por pagina`
            data.results.forEach((movie) => {
                const pelicula = createElement('div', 'cardMovie');
                const anchor = createElement('a', '');
                anchor.href = './pages/detalle.html';
                const img = createElement('img', 'imgTendencia', {
                    src: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                    alt: movie.title,
                    loading: 'lazy'
                });
                const tituloPelicula = createElement('div', 'tituloPelicula');
                const titulo = createElement('h4', '');
                titulo.textContent = movie.title;
                tituloPelicula.appendChild(titulo)
                pelicula.append(tituloPelicula,img)
    
                cardContainer.appendChild(pelicula)
            });
        }
    } catch(err) {
        console.log(err.message)
        alert('error al hacer la peticion')
    }
}