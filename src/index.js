import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

const URL = "https://pixabay.com/api/";
const API_KEY = "55978789-34cee20f3e80b0b0a22936120";

let instance = null
let search = "";
let limit = 12;
let page = 1;

async function getImages(search, page) {
    const res = await fetch(
    `${URL}?key=${API_KEY}&q=${search}&page=${page}&per_page=${limit}`,
  );
  const data = await res.json()
  return data
}

const formRef = document.querySelector(".search-form");
const galleryRef = document.querySelector(".gallery")
formRef.addEventListener("submit", async (e)=>{
    e.preventDefault()
    search = e.currentTarget.elements.query.value

    const res = await getImages(search, page);
    console.log(res);
    
    await render(res.hits)

    
})

function render(array){

    const item = array.map(({webformatURL, largeImageURL, likes, views, comments, downloads, tags}) =>{
        return`<li class="photo-card">

  <img src="${webformatURL}" alt="${tags}" data-src="${largeImageURL}"/>



  <div class="stats">

    <p class="stats-item">

      <i class="material-icons">thumb_up</i>

      ${likes}

    </p>

    <p class="stats-item">

      <i class="material-icons">visibility</i>

      ${views}

    </p>

    <p class="stats-item">

      <i class="material-icons">comment</i>

      ${comments}

    </p>

    <p class="stats-item">

      <i class="material-icons">cloud_download</i>

      ${downloads}

    </p>

  </div>

</li>`
    }).join("")
    galleryRef.insertAdjacentHTML("beforeend", item)
}

const divRef = document.querySelector(".elements");
const observer = new IntersectionObserver((entry)=>{
    console.log(entry);
    entry.forEach(async (e)=>{

        if (e.isIntersecting && search !== "") {
            page += 1
            const res = await getImages(search, page)
            await render(res.hits)
        }
    })
    
}, {
    rootMargin: "200px"
})
observer.observe(divRef)
galleryRef.addEventListener("click", async (event) => {
    
    if (event.target.nodeName !== "IMG") {
        return
    }

    const largeImg = event.target.dataset.src;


     instance = basicLightbox.create(`
    <div class="modal">
        <img src="${largeImg}" alt="#"/>
    </div>
`)

instance.show()


if (instance) {
 window.addEventListener("keydown", closeModal)   
}
})
if (!instance) {
 window.removeEventListener("keydown", closeModal)   
}

function closeModal(e) {
   if (e.key === "Escape") {
         instance.close()
         instance = null
    } 
}
