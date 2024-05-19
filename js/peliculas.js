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

const cardContainer = document.querySelector('.contenedor-cartas')

let url = new URL(window.location)
let params = new URLSearchParams(url.search)
params.set('page', 1)
let page = params.get('page')
params.set('endpoint', `/movie/popular?page=`)
let endpoint = params.get('endpoint')
let maxPage;


window.onload = async () => {
    try {
        handleCards(endpoint)
        const pagination = document.querySelector('div#pagination')
        const prevPage = createElement('button','pagination')
        prevPage.innerHTML = 'anterior'
        prevPage.onclick = () => {
            if (+page <= 1) prevPage.disabled = true; 
            else {
                prevPage.disabled = false;
                page = +page-1
                params.set('page', page)
                handleCards(endpoint+page)
                console.log(params.get('page'))
            }
        }
        const nextPage = createElement('button','pagination')
        nextPage.innerHTML = 'Siguiente'
        nextPage.onclick = () => {
            if (+page == maxPage) nextPage.disabled = true; 
            else {
                nextPage.disabled = false;
                page = +page+1
                params.set('page', page)
                handleCards(endpoint+page)
                console.log(params.get('page'))
            }
        }
        pagination.append(prevPage, nextPage)
       
    } catch (err) {
        console.log(err)
        alert('hubo un error en la peticion al API')
    }
}

async function handleCards(endpoint) {
    try {
        const data = await fetchData(endpoint)
        const pagination = document.querySelector('div#pagination')
        let paginasDetail;
        maxPage = data.total_pages
        if (document.querySelector('small#paginas')) {
            paginasDetail = document.querySelector('small#paginas')
            paginasDetail.innerHTML = `Pagina <b>${data.page}</b> de <b>${maxPage}</b>, mostrando ${data.results.length} elementos por pagina`
        } else {
            paginasDetail = `<small id="paginas">Pagina <b>${data.page}</b> de <b>${maxPage}</b>, mostrando ${data.results.length} elementos por pagina</small>`
            pagination.insertAdjacentHTML('beforeend',paginasDetail)
        }
        cardContainer.replaceChildren()
        data.results.forEach((movie) => {
            const pelicula = createElement('div', 'cardMovie', {
                'data-aos': 'zoom-in',
                'data-aos-duration': '1000',
                'aos-init': '',
                'aos-animate': '',
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
            pelicula.onclick = (e) => {handleDetail(movie.id)}
            pelicula.append(tituloPelicula,img)

            cardContainer.appendChild(pelicula)
        });
    } catch (error) {
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
        page = 1
        endpoint = `/search/movie?query=${query}&include_adult=false&language=en-US&page=`
        handleCards(endpoint+page)
    } catch(err) {
        console.log(err.message)
        alert('error al hacer la peticion')
    }
}

async function handleDetail (id) {
    try {
        const movie = await fetchData(`/movie/${+id}?language=en-US`)
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
