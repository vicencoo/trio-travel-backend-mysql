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

const hotelValidationRules = () => {
  return [
    body('hotel_name').notEmpty().withMessage('Plotëso emrin e hotelit.'),

    body('location').notEmpty().withMessage('Lokacioni duhet të plotësohet.'),

    body('description').notEmpty().withMessage('Plotëso emrin e hotelit.'),

    body('rating')
      .notEmpty()
      .withMessage('Vlerësimi i hotelit duhet të plotësohet.')
      .isFloat({ min: 0, max: 5 })
      .withMessage('Vlerësimi duhet të jetë një numër midis 0 dhe 5.'),

    body('reviews')
      .notEmpty()
      .withMessage('Numri i komenteve duhet të plotësohet.')
      .isInt({ min: 0 })
      .withMessage(
        'Numri i komenteve duhet të jetë një numër i plotë pozitiv.',
      ),

    body('price')
      .notEmpty()
      .withMessage('Çmimi duhet të plotësohet.')
      .isFloat({ min: 0 })
      .withMessage('Çmimi duhet të jetë një numër pozitiv.'),
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
  hotelValidationRules,
  validate,
};
