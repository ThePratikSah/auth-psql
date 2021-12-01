import bcrypt from "bcryptjs";
import User from "../Models/user";

export let registerUserService = async (body) => {
  try {
    // all the fields which we receive here are already sanitized
    let { name, email, password } = body;

    // hashing the password here before storing in the database
    const hashedPassword = await bcrypt.hash(password, 12);

    // we can now proced with the registration process
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return;
  } catch (error) {
    throw error;
  }
};

export let loginService = async (body) => {
  try {
    let { email } = body;

    // logic for logging user in
    // fetching the user with the provided email
    return await User.findOne({
      where: {
        email,
      },
      raw: true,
    });
  } catch (error) {
    throw error;
  }
};
