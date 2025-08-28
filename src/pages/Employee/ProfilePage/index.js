import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../../contexts/AuthContext";
import { updateUser } from "../../../services/userService";

// Reutilizando componentes de formulário da CreateProjectPage
const FormWrapper = styled.div`
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.borderRadius};
    padding: ${({ theme }) => theme.spacing.large};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    max-width: 800px;
    margin: auto;
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const Form = styled.form`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.large};

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.small};
`;

const Label = styled.label`
    font-weight: bold;
    color: ${({ theme }) => theme.colors.textLight};
`;

const Input = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
`;

const Button = styled.button`
    padding: 12px 24px;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border-radius: 4px;
    font-size: 16px;
    font-weight: bold;
    grid-column: 2 / 3;
    justify-self: end;

    @media (max-width: 768px) {
        grid-column: 1 / -1;
        width: 100%;
    }
`;

const ProfilePage = () => {
    const { user, login } = useAuth(); // Precisamos do login para atualizar o contexto
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "", // Adicione 'phone' ao seu db.json se não houver
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword && newPassword !== confirmPassword) {
            alert("As novas senhas não coincidem!");
            return;
        }

        try {
            const dataToUpdate = {
                ...formData,
            };

            if (newPassword) {
                dataToUpdate.password = newPassword;
            }

            // const password = user.password;
            const updatedUser = await updateUser(user.id, dataToUpdate);
            alert("Perfil atualizado com sucesso!");
            await login(updatedUser.email, updatedUser.password);

            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            alert("Não foi possível atualizar o perfil.");
        }
    };

    return (
        <FormWrapper>
            <Title>Meu Perfil</Title>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </FormGroup>

                <FormGroup fullWidth>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </FormGroup>

                <hr
                    style={{
                        gridColumn: "1 / -1",
                        border: "none",
                        borderTop: "1px solid #eee",
                    }}
                />

                <FormGroup>
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        placeholder="Deixe em branco para não alterar"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="confirmPassword">
                        Confirmar Nova Senha
                    </Label>
                    <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirme a nova senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </FormGroup>

                {/* Adicionar campos de CPF/CNPJ aqui se necessário */}

                <FormGroup>
                    {/* Espaço em branco para alinhar o botão */}
                </FormGroup>

                <Button type="submit">Salvar Alterações</Button>
            </Form>
        </FormWrapper>
    );
};

export default ProfilePage;
