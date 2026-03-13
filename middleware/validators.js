const { body, validationResult } = require('express-validator');

const propertyValidationRules = () => {
  return [
    body('title').notEmpty().withMessage('Shrkuani titullin e postimit'),
    body('property_type').notEmpty().withMessage('Selektoni tipin e pronës'),
    body('description').notEmpty().withMessage('Shkruani përshkrimin e pronës'),
    body('city').notEmpty().withMessage('Shkruani qytetin'),
    body('street').notEmpty().withMessage('Shkruani emrin e rrugës'),
    body('area').notEmpty().withMessage('Shkruani emrin e zonës'),
    body('price')
      .notEmpty()
      .withMessage('Vendosni cmimin e pronës')
      .isNumeric()
      .withMessage('Çmimi duhet të jetë një numër i vlefshëm'),
    body('space').notEmpty().withMessage('Shkruani hapësirën e pronës'),
  ];
};

const packageValidationRules = () => {
  return [
    body('title').notEmpty().withMessage('Shkuani titullin e pakëtes'),
    body('destination').notEmpty().withMessage('Shkruani destinacionin'),
    body('price').notEmpty().withMessage('Vendosni cmimin e paketës'),
    body('duration').notEmpty().withMessage('Shkruani kohëzgjatjen'),
    body('description')
      .notEmpty()
      .withMessage('Shkruani përshkrimin e paketës'),
    body('accomodation').notEmpty().withMessage('Zgjidhni akomodimin'),
    body('meal_included').notEmpty().withMessage('Zgjidhni vaktet e përfshira'),
  ];
};

const planeTicketValidationRules = () => {
  return [
    body('from')
      .notEmpty()
      .withMessage('Ju lutemi shkruani aeroportin e nisjes.'),

    body('to')
      .notEmpty()
      .withMessage('Ju lutemi shkruani aeroportin e destinacionit.'),

    body('departure_airport')
      .notEmpty()
      .withMessage(
        'Ju lutemi shkruani kodin e aeroportit të nisjes (p.sh. "TIA").',
      ),

    body('arrival_airport')
      .notEmpty()
      .withMessage(
        'Ju lutemi shkruani kodin e aeroportit të destinacionit (p.sh. "NYC").',
      ),

    body('price')
      .notEmpty()
      .withMessage('Ju lutemi vendosni çmimin e biletës.')
      .isNumeric()
      .withMessage('Çmimi duhet të jetë një numër i vlefshëm.'),
  ];
};

const destinationValidateRules = () => {
  return [
    body('city').notEmpty().withMessage('Shkruani qytetin.'),
    body('country').notEmpty().withMessage('Shkruani shtetin.'),
    body('slogan').notEmpty().withMessage('Shkruani sloganin.'),
  ];
};

const bookingValidationRules = () => {
  return [
    body('client_name')
      .notEmpty()
      .withMessage('Ju lutem shkruani emrin e klinetit'),

    body('ticket_code').notEmpty().withMessage('Shkruani kodin e biletës'),

    body('ticket_date')
      .notEmpty()
      .withMessage('Zgjidhni datën që do të beni check in të biletës'),

    body('ticket_price').notEmpty().withMessage('Vendosni cmimin e biletës'),
  ];
};

const loginValidationRules = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Ju lutemi shkruani një email të vlefshëm.'),

    body('password').notEmpty().withMessage('Ju lutemi shkruani fjalëkalimin.'),
  ];
};

const signupValidationRules = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Ju lutemi shkruani një email të vlefshëm.'),
    body('username')
      .notEmpty()
      .withMessage('Ju lutemi shkruani një emër përdoruesi.'),
    body('password')
      .isLength({ min: 7 })
      .withMessage('Fjalëkalimi duhet të jetë të paktën 7 karaktere.'),
  ];
};

const insuranceValidationRules = () => {
  return [
    body('client_name').notEmpty().withMessage('Vendosni emrin e klientit.'),
    body('contact_number')
      .notEmpty()
      .withMessage('Vendosni një numër telefoni.')
      .isMobilePhone()
      .withMessage('Vendosni një numër të vlefshëm.'),
    body('car_plate').notEmpty().withMessage('Vendosni një targë makine.'),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  propertyValidationRules,
  packageValidationRules,
  planeTicketValidationRules,
  destinationValidateRules,
  bookingValidationRules,
  loginValidationRules,
  signupValidationRules,
  insuranceValidationRules,
  validate,
};
