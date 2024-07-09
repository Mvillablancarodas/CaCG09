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
}
