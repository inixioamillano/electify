import { MillionsPipe } from './millions.pipe';

describe('MillionsPipe', () => {
  it('create an instance', () => {
    const pipe = new MillionsPipe();
    expect(pipe).toBeTruthy();
  });
});
