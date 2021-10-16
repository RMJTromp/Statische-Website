document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const gallery = body.querySelector("#gallery");

    const closeCurrentModal = () => {
        // remove modal element
        const currentModal = body.querySelector("div.modal");
        if(currentModal != null) currentModal.remove();

        // enable scrolling
        body.style.overflow = "";
    }

    let page = 1, lastLoad = 0;
    const loadImages = () => {
        // 1 second cooldown
        if(Date.now() - lastLoad <= 1000) return;
        lastLoad = Date.now();

        fetch(`https://picsum.photos/v2/list?page=${page}`)
            .then(async (response) => {
                const images = await response.json();
                images.forEach(image => {
                    const imageWrapper = document.createElement("div");
                    imageWrapper.classList.add("image");

                    const img = document.createElement("img");
                    img.setAttribute("src", `https://picsum.photos/id/${image.id}/200/200`);
                    img.setAttribute("width", "200");
                    img.setAttribute("height", "200");
                    img.setAttribute("loading", "lazy");
                    img.setAttribute("alt", image.author ?? "");
                    imageWrapper.append(img);

                    const author = document.createElement("p");
                    author.innerText = image.author;
                    imageWrapper.append(author);

                    // open image modal when the image is clicked
                    imageWrapper.addEventListener("click", () => {
                        closeCurrentModal();

                        const modal = document.createElement("div");
                        modal.classList.add("modal");

                        const picture = document.createElement("picture");

                        for(let i = 200; i <= 600; i += 200) {
                            const source = document.createElement("source");
                            source.setAttribute("media", `(max-width:${i}px)`);
                            source.setAttribute("srcset", `https://picsum.photos/id/${image.id}/${i}/${i}`);
                            picture.append(source);
                        }

                        const img1 = document.createElement("img");
                        img1.setAttribute("src", `https://picsum.photos/id/${image.id}/800/800`);
                        img1.setAttribute("alt", image.author ?? "");
                        img1.setAttribute("width", "800");
                        img1.setAttribute("height", "800");
                        picture.append(img1);

                        modal.append(picture);

                        // if specifically the modal is clicked, close the modal
                        modal.addEventListener("click", (e) => {
                            if(e.target === modal) closeCurrentModal();
                        });

                        // disable scrolling
                        body.style.overflow = "hidden";

                        // append element
                        body.append(modal);
                    });

                    gallery.append(imageWrapper);
                });
                page++;
            });
    };

    loadImages();

    // when user reaches 250px close to the bottom, load 30 more images
    document.addEventListener('scroll', () => {
        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 250) {
            loadImages();
        }
    });

    // close open modal if escape is clicked
    document.addEventListener("keydown", e => {
        if(e.key === "Escape") closeCurrentModal();
    })
});