import api from "./api";

export const getAllPeople = async () => {
    try {
        const response = await api.get("/users");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar pessoas:", error);
        return []; // Retorna uma lista vazia em caso de erro
    }
};

// Pré-regista qualquer pessoa (cliente, funcionário, admin) na tabela `/users`
export const preRegisterPerson = async (personData) => {
    const { personType, ...dataToSave } = personData;
    const finalData = {
        ...dataToSave,
        id: Date.now().toString(), // Garante um ID de texto único
    };

    try {
        const response = await api.post("/users", finalData);
        return response.data;
    } catch (error) {
        console.error("Erro no pré-registo:", error);
        throw error;
    }
};

// Finaliza o registo de qualquer pessoa na tabela `/users`
export const completeRegistration = async (userId, role, registrationData) => {
    const endpoint = `/users/${userId}`;
    try {
        const response = await api.patch(endpoint, registrationData);
        return response.data;
    } catch (error) {
        console.error("Erro ao completar registo:", error);
        throw error;
    }
};

// Atualiza o perfil de qualquer pessoa na tabela `/users`
export const updatePerson = async (person, dataToUpdate) => {
    const endpoint = `/users/${person.id}`;
    try {
        const response = await api.patch(endpoint, dataToUpdate);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar pessoa:", error);
        throw error;
    }
};
