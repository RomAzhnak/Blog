const uploadFile = require("../middleware/upload");
fs = require('fs');
const baseUrl = 'http://localhost:4000/auth/files/';

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);
    const { userName, email, password, role, urlAvatar } = req.body;
    console.log(req.body, userName, email, password, role, urlAvatar);
    const user = await User.findOne({
      where: { email: email }
    });
    if (!user) {
      throw new Error("Failed! User Not found!");
    };
    const passwordIsValid = bcrypt.compareSync(
      password,
      user.password
    );
    if (!passwordIsValid) {
      throw new Error("Failed! Invalid Password!");
    };
    if ((user.urlAvatar !== urlAvatar) && (req.file !== undefined)) {
      const filename = req.file.originalname;
      const result = await User.update({
        urlAvatar: baseUrl + filename,
      },
        {
          where: { email: email }
        });
      if (!result) {
        throw new Error("Failed update!");
      };
    }
    const result = await User.update({
      userName: userName,
      roleId: role,
    },
      {
        where: { email: email }
      });
    if (!result) {
      throw new Error("Failed update!");
    };
    res.status(200).send({
      userName: userName,
      email: email,
      role: role,
      urlAvatar: urlAvatar,
      accessToken: ''
    })
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/static/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

module.exports = {
  upload,
  getListFiles,
  download,
};