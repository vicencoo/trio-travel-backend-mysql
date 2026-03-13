/** @type {import('sequelize').ModelStatic<any>} */
const Property = require('./Property');
/** @type {import('sequelize').ModelStatic<any>} */
const PropertyImage = require('./PropertyImage');
/** @type {import('sequelize').ModelStatic<any>} */
const PlaneTicket = require('./PlaneTicket');
/** @type {import('sequelize').ModelStatic<any>} */
const PlaneTicketImage = require('./PlaneTicketImage');
/** @type {import('sequelize').ModelStatic<any>} */
const Package = require('./TouristPackage');
/** @type {import('sequelize').ModelStatic<any>} */
const PackageImage = require('./TouristPackageImage');
/** @type {import('sequelize').ModelStatic<any>} */
const Destination = require('./Destination');
/** @type {import('sequelize').ModelStatic<any>} */
const DestinationImage = require('./DestinationImage');
/** @type {import('sequelize').ModelStatic<any>} */
const DestinationType = require('./DestinationType');
/** @type {import('sequelize').ModelStatic<any>} */
const User = require('./User');
/** @type {import('sequelize').ModelStatic<any>} */
const RefreshToken = require('./RefreshToken');

// Property <--> PropertyImage

Property.hasMany(PropertyImage, {
  foreignKey: 'property_id',
  as: 'property_images',
});

PropertyImage.belongsTo(Property, {
  foreignKey: 'property_id',
  as: 'property',
});

//PlaneTicket <--> PlaneTicketImage
PlaneTicket.hasMany(PlaneTicketImage, {
  foreignKey: 'ticket_id',
  as: 'ticket_images',
});

PlaneTicketImage.belongsTo(PlaneTicket, {
  foreignKey: 'ticket_id',
  as: 'planeTicket',
});

//Package <--> PackageImage
Package.hasMany(PackageImage, {
  foreignKey: 'package_id',
  as: 'package_images',
});

PackageImage.belongsTo(Package, {
  foreignKey: 'package_id',
  as: 'package',
});

// Destination <--> DestinationImage <--> DestinationType
Destination.hasMany(DestinationImage, {
  foreignKey: 'destination_id',
  as: 'destination_images',
});
Destination.hasMany(DestinationType, {
  foreignKey: 'destination_id',
  as: 'destination_types',
});

DestinationImage.belongsTo(Destination, {
  foreignKey: 'destination_id',
  as: 'destination',
});
DestinationType.belongsTo(Destination, {
  foreignKey: 'destination_id',
  as: 'destination',
});

// User <--> Refresh Token
User.hasMany(RefreshToken, {
  foreignKey: 'user_id',
  as: 'refresh_tokens',
});

RefreshToken.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

module.exports = {
  Property,
  PropertyImage,
  PlaneTicket,
  PlaneTicketImage,
  Package,
  PackageImage,
  Destination,
  DestinationImage,
  DestinationType,
  User,
  RefreshToken,
};
