const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator: invalid rules', () => {
    it('empty rules', () => {
      const validator = new Validator();

      const errors = validator.validate({ age: 10 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.not.property('field');
      expect(errors[0]).to.have.property('error').and.to.be.equal('rules is empty');
    });
    it('without min', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          max: 20,
        },
      });

      const errors = validator.validate({ age: 11 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('min is unknown');
    });
    it('without max', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 20,
        },
      });

      const errors = validator.validate({ age: 11 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('max is unknown');
    });
  });

  describe('Validator: string', () => {
    it('меньше минимума', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });
    it('больше максимума', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'LalalaLalalaLalalaLalalaLalalaLalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 36');
    });
    it('корректный', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: '01234567890' });

      expect(errors).to.have.length(0);
    });
  });

  describe('Validator: number', () => {
    it('меньше минимума', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ age: 5 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 5');
    });
    it('больше максимума', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ age: 22 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 20, got 22');
    });
    it('корректный', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ age: 11 });

      expect(errors).to.have.length(0);
    });
  });

  describe('Validator: string && number', () => {
    it('string < min & number is correct', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala', age: 11 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });
    it('string < min & number < min', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala', age: 9 });

      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');

      expect(errors[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors[1]).to.have.property('error').and.to.be.equal('too little, expect 10, got 9');
    });
  });

  describe('Validator: unknown type', () => {
    it('boolean', () => {
      const validator = new Validator({
        isCorrect: {
          type: 'boolean',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ isCorrect: true });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('isCorrect');
      expect(errors[0]).to.have.property('error').and.to.be.equal('unknown type');
    });
  });

  describe('Validator: invalid type', () => {
    it('string is number', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 11 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
    });
    it('number is string', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ age: '11' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });
    it('mix', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ age: '11', name: 11 });

      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');

      expect(errors[1]).to.have.property('field').and.to.be.equal('name');
      expect(errors[1]).to.have.property('error').and.to.be.equal('expect string, got number');
    });
  });
});
