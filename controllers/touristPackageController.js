const { Package, PackageImage } = require('../models');
const clearImage = require('../utils/clearImage');

exports.addPackage = async (req, res) => {
  try {
    const { body } = req;
    const packageImageFiles = req.files;

    const package = await Package.create({
      title: body.title,
      destination: body.destination,
      price: Number(body.price),
      duration: Number(body.duration),
      description: body.description,
      accomodation: body.accomodation,
      meal_included: body.meal_included,
    });

    if (packageImageFiles.length) {
      const package_images = packageImageFiles.map((file) => ({
        image: `/images/package_images/${file.filename}`,
        package_id: package.id,
      }));
      await PackageImage.bulkCreate(package_images);
    }

    res.json({ message: 'Tourist Package added successfully!' });
  } catch (err) {
    console.error('Add package error', err);
    res.status(400).json({ message: 'Error while adding new tourist package' });
  }
};

exports.getPackages = async (req, res) => {
  try {
    const { packageLimit, page = 1 } = req.query;
    const DEFAULT_LIMIT = 20;

    const itemsPerPage = Math.min(
      Number(packageLimit) || DEFAULT_LIMIT,
      DEFAULT_LIMIT,
    );
    const skip = (page - 1) * itemsPerPage;

    const { rows: packages, count: totalCount } = await Package.findAndCountAll(
      {
        limit: itemsPerPage,
        offset: skip,
        include: [
          {
            model: PackageImage,
            as: 'package_images',
            attributes: ['id', 'image'],
          },
        ],
        distinct: true,
        order: [['createdAt', 'DESC']],
      },
    );
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const pagination = { totalPages, totalPackages: totalCount };

    res.json({ packages, pagination });
  } catch (err) {
    console.error('Getting packages error', err);
    res.status(400).json({ message: 'Error while getting packages' });
  }
};

exports.getPackage = async (req, res) => {
  try {
    const { packageId } = req.query;

    const package = await Package.findByPk(packageId, {
      include: [
        {
          model: PackageImage,
          as: 'package_images',
          attributes: ['id', 'image'],
        },
      ],
    });

    res.json(package);
  } catch (err) {
    console.error('Get package error', err);
    res.status(400).json({ message: 'Error while getting a package' });
  }
};

exports.editPackage = async (req, res) => {
  try {
    const { packageId } = req.query;
    const { body } = req;
    const newImageFiles = req.files;
    const deletedImgs = body.deletedImages
      ? JSON.parse(body.deletedImages)
      : [];

    const package = await Package.findByPk(packageId);

    if (!package)
      return res.status(404).json({ message: 'No package found to edit' });

    await package.update({
      title: body.title,
      destination: body.destination,
      price: Number(body.price),
      duration: Number(body.duration),
      description: body.description,
      accomodation: body.accomodation,
      meal_included: body.meal_included,
    });

    if (deletedImgs.length) {
      const images = await PackageImage.findAll({
        where: { image: deletedImgs, package_id: package.id },
      });

      images.forEach((img) => {
        clearImage(img.image);
      });

      await PackageImage.destroy({
        where: { image: deletedImgs, package_id: package.id },
      });
    }

    if (newImageFiles.length) {
      const newImages = newImageFiles.map((file) => ({
        image: `/images/package_images/${file.filename}`,
        package_id: package.id,
      }));
      await PackageImage.bulkCreate(newImages);
    }

    res.json({ message: 'Package updated successfully!' });
  } catch (err) {
    console.error('Editing package error', err);
    res.status(400).json({ message: 'Error while editing package' });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const { packageId } = req.query;

    const package = await Package.findByPk(packageId, {
      include: [{ model: PackageImage, as: 'package_images' }],
    });

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    package.package_images.forEach((p) => clearImage(p.image));

    await PackageImage.destroy({ where: { packageId } });

    await Package.destroy({ where: { id: packageId } });

    res.json({ message: 'Package deleted' });
  } catch (err) {
    console.error('Deleting package error', err);
    res.status(400).json({ message: 'Error while deleting package' });
  }
};
