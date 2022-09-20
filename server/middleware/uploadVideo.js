const fs = require('fs');

module.exports = async function (req, res, next) {
  try {
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json({ message: 'No files were uploaded.' });

    if (req.body.duration > 600)
      return res
        .status(400)
        .json({ message: 'Maximum video length is 10 minutes.' });

    const file = req.files.file;

    if (file.size > 1024 * 1024 * 2048) {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ message: 'Maximum video size is 2gb.' });
    } // 2gb

    if (file.mimetype !== 'video/mp4' && file.mimetype !== 'video/webm') {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ message: 'File format is incorrect.' });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
