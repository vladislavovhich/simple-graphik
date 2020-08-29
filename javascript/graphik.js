let width;
let height;
let delenie = 10;
let x0;
let y0;
let graphik;
let context;

let btn = document.getElementById("build-graphik");

function drawOs() {
    width = graphik.width;
    height = graphik.height;
    x0 = width / 2;
    y0 = height / 2;

    context.strokeStyle = 'blue';

    context.beginPath();
    context.moveTo(0, y0);
    context.lineTo(width, y0);
    context.stroke();

    context.beginPath();
    context.moveTo(x0, 0);
    context.lineTo(x0, height);
    context.stroke();

    //left-x and right-x
    for (let i = x0 + delenie; i <= width; i += delenie) {
        context.beginPath();
        context.moveTo(i, y0 - 5);
        context.lineTo(i, y0 + 5);
        context.stroke();
    }
    for (let i = x0 - delenie; i >= 0; i -= delenie) {
        context.beginPath();
        context.moveTo(i, y0 - 5);
        context.lineTo(i, y0 + 5);
        context.stroke();
    }
    //top-y bottom-y
    for (let i = y0 - delenie; i >= 0; i -= delenie) {
        context.beginPath();
        context.moveTo(x0 - 5, i);
        context.lineTo(x0 + 5, i);
        context.stroke();
    }
    for (let i = x0 + delenie; i <= height; i += delenie) {
        context.beginPath();
        context.moveTo(x0 - 5, i);
        context.lineTo(x0 + 5, i);
        context.stroke();
    }
}

window.onload = () => {
    graphik = document.getElementById("graphik");
    context = graphik.getContext("2d");

    drawOs();

}

btn.addEventListener("click", () => {
    context.clearRect(0, 0, width, height);

    drawOs();

    context.fillStyle = "green";

    let func = document.getElementById("function-graphik").value;

    let replaceX = (value) => {
        let f = func;

        while (f.includes("x")) {
            f = f.replace("x", value);
        }

        return f;
    }

    let x = -25;

    while (x <= 25) {
        let replaced = replaceX(x);
        let y = calculator.calculate(replaced);

        let x1 = Math.round(x0 + delenie*x);
        let y1 = Math.round(y0 - delenie*y);

        context.fillRect(x1, y1, 2, 2);

        x += 0.005;
    }
});
/*
y := 1 / x;

x1 := Round(x0 + k*x);
y1 := Round(y0 - k*y);

setPixel(x1, y1, clRed);

x := x + 0.01;

 */