import User from '../models/User.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, manager, peers, juniors } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'staff',
      manager: manager || null,
      peers: peers || [],
      juniors: juniors || []
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        manager: user.manager,
        peers: user.peers,
        juniors: user.juniors
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { name, email, role, manager, peers, juniors } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.manager = manager || user.manager;
    user.peers = peers || user.peers;
    user.juniors = juniors || user.juniors;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      manager: updatedUser.manager,
      peers: updatedUser.peers,
      juniors: updatedUser.juniors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.remove();

    res.json({ message: 'User removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getTeamMembers = async (req, res) => {
  try {
    const managerId = req.params.id;

    const teamMembers = await User.find({ manager: managerId }).select('-password');

    res.json(teamMembers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserRelationships = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .select('-password')
      .populate('manager', 'name email')
      .populate('peers', 'name email')
      .populate('juniors', 'name email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      manager: user.manager,
      peers: user.peers,
      juniors: user.juniors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
