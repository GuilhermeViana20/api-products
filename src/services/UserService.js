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
		const user = await getUser(id);
		if (user) {
			await userRepository.update(id, data);
		}
		return user;
	};

	return {
		storeUser,
		listUsers,
		getUser,
		updateUser,
	};
};
