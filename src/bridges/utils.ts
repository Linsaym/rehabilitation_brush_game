const randomIntBetween = (min: number, max: number): number => {
  // получить случайное число  от (min-0.5) до (max+0.5)
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};

const degToRad = (deg: number): number => {
  const rad = deg * Math.PI / 180;
  return rad;
}

const radToDeg = (rad: number): number => {
  const deg = rad * 180 / Math.PI;
  return deg;
}

export {
  randomIntBetween,
  degToRad,
  radToDeg,
}