module.exports = (
	userRepository
) => {

	const storeUser = async (data) => {
		return await userRepository.create(data);
	};

	const listUsers = () => userRepository.getAll();

	const getUser = async (id) => {
		const user = await userRepository.findById(id);
		if (!user) {
			throw new Error('Usuário não encontrado');
		}
		return user;
	};

	const updateUser = async (id, data) => {
		const userExists = await getUser(id);
		if (!userExists) {
			throw new Error('Usuário não encontrado');
		}
		await userRepository.update(id, data);
		return await getUser(id);
	};

	return {
		storeUser,
		listUsers,
		getUser,
		updateUser,
	};
};
