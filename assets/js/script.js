const $ = (selector) => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    {
        // navigatie balk

        const navigation = $("nav#navigation");
        const menu = navigation.querySelector("a#menu");

        const fixHeader = () => {
            if(Math.ceil(window.pageYOffset) < navigation.offsetTop) navigation.classList.remove("sticky");
            else if(!navigation.classList.contains("sticky")) navigation.classList.add("sticky");
        };

        {
            // Voeg automatisch "sticky" class aan navigatiebalk toe wanneer de gebruiker voorbij de header scrollt
            if(body.getAttribute("page") === "home") {
                window.addEventListener("scroll", () => fixHeader());
                fixHeader();
            } else navigation.classList.add("sticky");
        }

        {
            // Menu openen wanneer de gebruiker op het hamburger-menu klikt
            const icon = menu.querySelector("i");
            menu.addEventListener("click", () => {
                if(navigation.classList.toggle("open")) {
                    body.style.overflow = "hidden";
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-times");
                } else {
                    body.style.overflow = "";
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                    fixHeader();
                }
            });
        }

        {
            // Scroll naar de volgende sectie wanneer de gebruiker op de chevron klikt
            if(body.hasAttribute("page") && body.getAttribute("page") === "home")
                $("body > section#header > i#scroll").addEventListener("click", () => window.scrollTo({top: navigation.offsetTop, behavior: "smooth"}));
        }

        {
            const icon = menu.querySelector("i");
            window.addEventListener("resize", () => {
                if(window.innerWidth >= 1250 && navigation.classList.contains("open")) {
                    navigation.classList.remove("open");
                    body.style.overflow = "";
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                    fixHeader();
                }
            });
        }
    }

    {
        // footer
        const footer = $("footer");
        if(footer != null && footer.offsetTop + footer.offsetHeight !== Math.max(window.innerHeight, body.offsetHeight)) {
            footer.classList.add("sticky");
        }
    }
});