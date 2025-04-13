import { Container } from "react-bootstrap"
import EditProductForm from "../../components/EditProductForm/EditProductForm"

const EditProductPage = ({ closeModal, updateList }) => {
    return (
        <Container>
            <EditProductForm closeModal={closeModal} updateList={updateList} />
        </Container>
    )
}

export default EditProductPage