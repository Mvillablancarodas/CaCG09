async function fetchData(endpoint) {
    try {
        const res = await fetch(`http://${window.location.host}${endpoint}`, {
            method: 'GET',
            headers: {
                accept: 'application/json'
            }
        })
        const data = await res.json()
        return data
    } catch(error) {
        console.log(error)
    }
}

let errors = {}

function validateForm(input){
    const form = document.querySelector("form#addMovie");
    let {title, image, background_image, overview, release_date, genres} = form
    switch(input) {
        case 'title':
            break
        case 'image':
            break
        case 'background_image':
            break
        case 'overview':
            break
        case 'release_date':
            break
        case 'genres':
            break
        default:
            break
    }
}

async function handleGenres(){
    try{
        const genres = await fetchData("/genres")
        const divGenres = document.querySelector("div#genres")
        genres.forEach(({id,name}) => {
            const checkbox = `<span>
                    <input id="${name}" type="checkbox" name="genres" value="${id}"/>
                    <label for="${name}">${name}</label>
                </span>`
            divGenres.insertAdjacentHTML('beforeend',checkbox)
        })
    } catch(e) {console.log(e)}
}

window.onload = ()=> {
    handleGenres()
    const form = document.querySelector("form#addMovie");
    let {title, image, background_image, overview, release_date, genres} = form
    form.onsubmit = async (e) => {
        e.preventDefault()
        if (Object.keys(errors).length > 0) alert("Corregir los errores del formulario")
        else {
            try {
                const formData = {
                    title: title.value,
                    image: image.value,
                    background_image: background_image.value,
                    overview: overview.value,
                    release_date: release_date.value,
                    genres: genres.value
                }
                const resp = await fetch(`http://${window.location.host}/movies`, {
                    method: 'POST',
                    headers: {
                        accept: 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                if(resp.status != 201) {
                    console.log(resp)
                    alert("error en la peticion")
                } else {
                    const data = await resp.json()
                    console.log(data)
                    alert("pelicula creada")
                }
            } catch(e) {console.log(e)}
        }
    }
}
