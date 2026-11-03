/** Original paraxial teaching model. Not gkaModelEye or a clinical calculator.
 * Air before a single equivalent refracting surface; n=1.336 behind it.
 * An object at infinity has zero incident vergence. Power is in diopters.
 */
export function eyeFocus({power = 60, retinaMm = 22.27, correction = 0} = {}) {
  if (![power, retinaMm, correction].every(Number.isFinite) || power < 40 || power > 80 || retinaMm < 18 || retinaMm > 30 || Math.abs(correction) > 15) {
    throw new RangeError('Parameters outside the educational model range');
  }
  const focalMm = 1336 / (power + correction);
  const offsetMm = focalMm - retinaMm;
  return {focalMm, offsetMm, position: Math.abs(offsetMm) < 0.15 ? 'on' : offsetMm < 0 ? 'before' : 'behind'};
}
