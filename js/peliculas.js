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
        const paginas = createElement('small','pages', {
            'data-aos': 'zoom-in',
            'data-aos-duration': '1000',
            'aos-init': '',
            'aos-animate': '',
        })
        paginas.innerHTML = `Pagina <b>${data.page}</b> de <b>${data.total_pages}</b>, mostrando ${data.results.length} elementos por pagina`
        cardContainer.insertAdjacentElement('beforebegin', paginas)
        data.results.forEach((movie) => {
            const pelicula = createElement('div', 'cardMovie');
            const img = createElement('img', 'imgTendencia', {
                src: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                alt: movie.title,
                loading: 'lazy'
            });
            const tituloPelicula = createElement('div', 'tituloPelicula');
            const titulo = createElement('h4', '');
            titulo.textContent = movie.title;
            tituloPelicula.appendChild(titulo)
            pelicula.onclick = (e) => {handleDetail(movie.id)}
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
                const pelicula = createElement('div', 'cardMovie',{onClick: handleDetail(movie)});
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
                pelicula.onclick = (e) => {handleDetail(movie.id)}
                cardContainer.appendChild(pelicula)
            });
        }
    } catch(err) {
        console.log(err.message)
        alert('error al hacer la peticion')
    }
}

async function handleDetail (id) {
    try {
        const movie = await fetchData(`/movie/${+id}?language=en-US`)
        console.log(movie)
        const containerDetail = createElement('div','movieDetail-container')
        const closeBtn = createElement('button','delete')
        closeBtn.innerHTML= 'volver'
        closeBtn.onclick = (e)=> {
            e.preventDefault()
            e.target.parentNode.parentNode.remove()
        }
        const pelicula = createElement('div', 'movieDetail', {
            'data-aos': 'zoom-in',
            'data-aos-duration': '1000',
            'aos-init': '',
            'aos-animate': '',
            style: `background-image: linear-gradient(to right top, rgba(109, 105, 105, 0.655), rgba(109, 105, 105, 0.655)), url(https://image.tmdb.org/t/p/w500/${movie.backdrop_path})`
        });

        const img = createElement('img', 'imgTendencia', {
            src: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            alt: movie.title,
            loading: 'lazy'
        });
        const tituloPelicula = createElement('div', 'tituloPelicula');
        const titulo = createElement('h4', '');
        titulo.textContent = movie.title;
        tituloPelicula.appendChild(titulo)
        const infoContainer = createElement('div','movieInfo')
        infoContainer.appendChild(img)
        let movieInfo = `<div>
        <p>${movie.overview}</p>
        <p>${movie.release_date}<b>Genres</b>`
        movie.genres.forEach(({name}) => movieInfo += `${name}, `)
        movieInfo += `</p></div>`
        infoContainer.innerHTML += movieInfo
        pelicula.append(closeBtn,tituloPelicula,infoContainer)
        containerDetail.appendChild(pelicula)
        document.body.appendChild(containerDetail)

    } catch (err) {
        console.log(err)
    }
}
