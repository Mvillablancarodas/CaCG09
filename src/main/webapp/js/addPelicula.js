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
    const form = document.querySelector("form")
    form.onsubmit = async (e) => {

        try {
            const formData = {
                title: form.title.value,
                image: form.image.value,
                background_image: form.background_image.value,
                overview: form.overview.value,
                release_date: form.release_date.value,
                genres: form.genres.value
            }
            e.preventDefault()
            const resp = await fetch(`http://${window.location.host}/movies`, {
                method: 'POST',
                headers: {
                    accept: 'application/json'
                },
                body: JSON.stringify(formData)
            })
            if(resp.status != 201) alert("error en la peticion")
            else {
                const data = await resp.json()
                alert("pelicula creada")
                console.log(data)
            }
        } catch(e) {console.log(e)}

    }
}
