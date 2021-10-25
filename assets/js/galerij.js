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
        if(Date.now() - lastLoad <= 1000)
        lastLoad = Date.now();

        fetch(`https://picsum.photos/v2/list?page=${page}`)
            .then(async (response) => {
                const images = await response.json();
                images.forEach(image => {
                    const imageWrapper = $("<div>", {class: "image"});

                    imageWrapper.append($("<img>", {
                        src: `https://picsum.photos/id/${image.id}/200/200`,
                        width: 200,
                        height: 200,
                        loading: "lazy",
                        alt: image.author ?? ""
                    }));

                    const author = $("<p>");
                    author.innerText = image.author;
                    imageWrapper.append(author);

                    // open image modal when the image is clicked
                    imageWrapper.addEventListener("click", () => {
                        closeCurrentModal();

                        const modal = $("<div>", {class: "modal"});

                        const picture = $("<picture>");

                        for(let i = 200; i <= 600; i += 200) {
                            picture.append($("<source>", {
                                media: `(max-width:${i}px)`,
                                srcset: `https://picsum.photos/id/${image.id}/${i}/${i}`
                            }));
                        }

                        picture.append($("<img>", {
                            src: `https://picsum.photos/id/${image.id}/800/800`,
                            alt: image.author ?? "",
                            width: 800,
                            height: 800
                        }));

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

    const isNearBottom = () => window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 250;

    // when user reaches 250px close to the bottom, load 30 more images
    document.addEventListener('scroll', () => {
        if(isNearBottom()) loadImages();
    });

    // close open modal if escape is clicked
    document.addEventListener("keydown", e => {
        if(e.key === "Escape") closeCurrentModal();
    })
});