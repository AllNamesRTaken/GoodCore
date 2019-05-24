function randomInt(min: number = 0, max: number = 10): number {
	return randomNumber(min, max) | 0;
}
function randomNumber(min: number = 0, max: number = 10): number {
	return (Math.random() * (max + 1 - min)) + min;
}
console.log(randomInt(0,1));
console.log(randomInt(0,1));
console.log(randomInt(0,1));
console.log(randomInt(0,1));
console.log(randomInt(0,1));
console.log(randomInt(0,1));
console.log(randomInt(0,1));