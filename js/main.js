// Get viewport dimensions
var h = $(window).height();
var w = $(window).width();

var blobH = $('.blobs').height();
var blobW = $('.blobs').width();

console.log(blobH)
console.log(blobW)

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(CSSPlugin);
gsap.registerPlugin(DrawSVGPlugin);
gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(ScrollTrigger);

loadProjectDisplay();

blobCount = 0;
animationarray = [];

$(window).on("load", function(){

    if (w > 800) {
        $('#olympics').addClass('selected');
        loadProjectDisplay();

        loadAnimation();
        createBlobs();
    }

});


function createBlobs() {

    $('.blob').each(function(){
        blobCount += 1
        animateBlob("b" + blobCount);
    });

}


function loadAnimation() {
    $('.lines').css('visibility', 'visible')
    $('.blob-overlay').css('visibility', 'visible')

    gsap.defaultOverwrite = false;

    const loading = gsap.timeline()
    loading.add('start')
    loading.fromTo(".background-overlay", {scaleX: 1.1, duration: 0}, {scaleX: 1, duration: 1, ease:"power2.out"}, 'start')
    loading.from(".blob", {scale: 0, delay: .1, autoAlpha: 0, rotation: 0.01, force3D:true, stagger: .2, duration: 1.5, ease:"power2.out"}, 'start')
    loading.from('.line', {drawSVG:'0%', delay: .4, duration: .7, stagger: 0.1, ease:"Power2.easeInOut"}, 'start')
    loading.then(toTwo())
    loading.then(toThree())
    loading.then(toFour())

    function toTwo() {
        const homepage = gsap.timeline({
            scrollTrigger: {
                scroller: ".page-scroll",
                trigger: "#page-1",
                start: "0%",
                end: '100%',
                scrub: true,
                anticipatePin: 1,
                toggleActions: "play none none reverse",
                immediateRender: false
            }
        });
        homepage.add('start')
        homepage.from('.list-wrapper', {y: '100%', duration: 1, delay: 1.2}, 'start')
        homepage.from('.project-display', {y: '100%', duration: 2, delay: 1.5}, 'start')
        homepage.to(".homepage-content", {delay: .5, duration: 1.5, y: -2000, rotation: 0.01, force3D:true}, 'start')
        homepage.to(".line", {keyframes:[{drawSVG: 0, stroke: 'var(--accent)', duration: .3, force3D:true, stagger: -.1}, {autoAlpha: 0}]}, 'start')
        homepage.fromTo(".background-overlay", {scaleX: 1, duration: 0}, {scaleX: 0, delay: 1, duration: 2, rotation:0.001}, 'start')
        homepage.to("#overlay-color-rect", { delay: 1, duration: .3}, 'start')
        homepage.to(".down-arrow", {delay: .2, duration: 1, x: "-100vw"}, 'start')
        homepage.to(".blob", {keyframes:[{scale: 0.01, stagger: .08, duration: .3}, {autoAlpha: 0}]}, 'start')
        homepage.to(".blobs", {autoAlpha: 0, duration: 1, delay: 1}, 'start')
    }

    function toThree() {
        const illustration = gsap.timeline({
            scrollTrigger: {
                scroller: ".page-scroll",
                trigger: "#page-2",
                start: "0%",
                end: "100%",
                scrub: true,
                anticipatePin: 1,
                toggleActions: "play none none reverse"
            }
        });
        illustration.add('start')
        illustration.from('.illustration', {y: '100%', stagger: 1, duration:2, delay: 2, ease:"power2.out"}, 'start')
        illustration.fromTo(".background-overlay", {scaleX: 0, duration: 0}, {scaleX: 2, duration: 2}, 'start')

    }


    function toFour() {
        const about = gsap.timeline({
            scrollTrigger: {
                scroller: ".page-scroll",
                trigger: "#page-3",
                start: "0%",
                end: "100%",
                scrub: true,
                anticipatePin: 1,
                toggleActions: "play none none reverse",
                immediateRender: false
            }
        });
        about.add('start')
        about.fromTo(".background-overlay", {scaleX: 2, duration: 0}, {scaleX: 1, duration: 2, delay: 1}, 'start')
        about.to("#overlay-color-rect", {fill: "#5d00e0", duration: 1}, 'start')
        about.to(".blob", {keyframes:[{scale: 1}, {autoAlpha: 1}]}, 'start')
        about.to(".blobs", {autoAlpha: 1, duration: 1, delay: 1}, 'start')
    }
}

function animateBlob(blob) {

    // Create random points for blob path
    var newData = d3.range(3).map(function(){
        return [Math.floor(Math.random() * (blobW)), Math.floor(Math.random() * blobH)]
    });

    // Generate a curved path for smooth blob moving
    var lineGenerator = d3.line().curve(d3.curveNatural);
    var pathString = lineGenerator(newData)  + " z";

    var animation = gsap.to("#" + blob, {
                        motionPath: pathString,
                        duration: 60,
                        yoyo: true,
                        repeat: -1,
                        ease: "linear",
                        force3D:true,
                        rotation: 0.01
                    });

    animationarray.push(animation);
}

$('.skill').hover(function() {
    $(this).attr('style', 'color:var(--homepage); background-position: 0% 50%; background-size: 100% 80%;  transition: color .2s ease-in, background-position .3s, background-size .3s ease-in .1s')
}, function(){
    $(this).attr('style', 'background-position: 0% 50%; color: #4f4c4e; background-size: 0% 80%; transition: color .3s, background-size .3s, background-position .3s ease-in;')
});

function loadProjectDisplay() {
    $('.project-display').empty();

    let selectedProject = $('.selected').attr('id');
    switch (selectedProject) {
        case 'olympics': $('.project-display').append(olympics); break;
        case 'fashion': loadFashion(); break;
        case 'jester': $('.project-display').append(jester); break;
        case 'ai-explorer': $('.project-display').append(aiExplorer); break;
        case 'novel-art': $('.project-display').append(novelArt); break;
        case 'womens-issue': $('.project-display').append(womensIssue); break;
        case 'hueseum': $('.project-display').append(hueseum); break;
        case 'spirograph': $('.project-display').append(spirograph); break;
        case 'piano-lamp': $('.project-display').append(pianoLamp); break;
    }

    gsap.to('.project-display', {scrollTo: 0})
}

function updateSelected(element) {
    if (w < 800) {
        if ($(element).hasClass('selected')) {
            $(element).removeClass('selected')
        } else {
            $('.selected').removeClass('selected')
            $(element).addClass('selected')
        }
    } else {
        $('.selected').removeClass('selected')
        $(element).addClass('selected')
    }


    loadProjectDisplay();

}


function scroll1() {
    gsap.to('.page-scroll', {keyframes: [{scrollSnapType: 'none'}, {scrollTo: {y: "#page-1", duration: 1}, ease: "power2"}, {scrollSnapType: 'y mandatory'}]});
}

function scroll2() {
    gsap.to('.page-scroll', {keyframes: [{scrollSnapType: 'none'}, {scrollTo: {y: "#page-2", duration: 1}, ease: "power2"}, {scrollSnapType: 'y mandatory'}]});
}

function scroll3() {
    gsap.to('.page-scroll', {keyframes: [{scrollSnapType: 'none'}, {scrollTo: {y: "#page-3", duration: 1}, ease: "power2"}, {scrollSnapType: 'y mandatory'}]});
}

function scroll4(){
    gsap.to('.page-scroll', {keyframes: [{scrollSnapType: 'none'}, {scrollTo: {y: "#page-4", duration: 1}, ease: "power2"}, {scrollSnapType: 'y mandatory'}]});
}



function loadFashion() {
    $('.project-display').append(fashion);

    PDFObject.embed("./assets/FSF Case Study _ Marie Konopacki.pdf", "#pdf");

}

