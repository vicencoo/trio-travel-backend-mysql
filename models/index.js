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
const Hotel = require('./Hotel');
/** @type {import('sequelize').ModelStatic<any>} */
const HotelImage = require('./HotelImage');
/** @type {import('sequelize').ModelStatic<any>} */
const HotelFacility = require('./HotelFacility');

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

// Hotel <--> HotelImage <--> HotelFacility
Hotel.hasMany(HotelImage, { foreignKey: 'hotel_id', as: 'hotel_images' });
Hotel.hasMany(HotelFacility, { foreignKey: 'hotel_id', as: 'facilities' });

HotelImage.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });
HotelFacility.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

module.exports = {
  Property,
  PropertyImage,
  PlaneTicket,
  PlaneTicketImage,
  Package,
  PackageImage,
  Hotel,
  HotelImage,
  HotelFacility,
};
