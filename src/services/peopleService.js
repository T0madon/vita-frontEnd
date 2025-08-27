import api from "./api";

export const getAllPeople = async () => {
    try {
        const [usersResponse, clientsResponse] = await Promise.all([
            api.get("/users"),
            api.get("/clients"),
        ]);
        return { users: usersResponse.data, clients: clientsResponse.data };
    } catch (error) {
        console.error("Erro ao buscar pessoas:", error);
        return { users: [], clients: [] };
    }
};

// Esta função fará o pré-registo
export const preRegisterPerson = async (personData) => {
    const { personType, ...dataToSave } = personData;
    // Por agora, vamos criar um utilizador simples. A lógica PF/PJ pode ser adicionada depois.
    // O objeto `personData` virá do formulário do admin.
    try {
        let response;
        if (dataToSave.role === "client") {
            response = await api.post("/clients", dataToSave);
        } else {
            // para 'employee' e 'admin'
            response = await api.post("/users", dataToSave);
        }
        return response.data;
    } catch (error) {
        console.error("Erro no pré-registo:", error);
        throw error;
    }
};

// Esta função irá finalizar o registo
export const completeRegistration = async (userId, role, registrationData) => {
    const endpoint =
        role === "client" ? `/clients/${userId}` : `/users/${userId}`;
    try {
        const response = await api.patch(endpoint, registrationData);
        return response.data;
    } catch (error) {
        console.error("Erro ao completar registo:", error);
        throw error;
    }
};
