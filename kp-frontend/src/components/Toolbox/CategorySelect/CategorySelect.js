import React from 'react';
import { Translate } from "react-localize-redux";
import { Container, Row, Col, ListGroup, ListGroupItem, Badge, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FaEdit } from 'react-icons/fa';
import classNames from 'classnames';
import colors from '../../../css/colors.css';
import classes from './CategorySelect.css';

class CategorySelect extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            modal: false,

            categoryId: 0,
            subcategoryId: 0,
            categoryMap: new Map(),
            subcategoryMap: new Map(),
        };

        this.toggle = this.toggle.bind(this);
        this.openCategorySelectModal = this.openCategorySelectModal.bind(this);
        this.submitCategory = this.submitCategory.bind(this);

        this.categorySelected = this.categorySelected.bind(this);
        this.subcategorySelected = this.subcategorySelected.bind(this);
    }

    categorySelected(id) {
        this.setState({
            categoryId: id,
            subcategoryId: 0,
            subcategoryMap: id !== 0 ? this.state.categoryMap.get(id).subcategoryMap : new Map(),
        });
    }

    subcategorySelected(id) {
        this.setState({
            subcategoryId: id,
        });
    }

    openCategorySelectModal() {
        this.toggle();

        let categoryId = this.props.categoryId;

        this.setState({
            categoryId: this.props.categoryId,
            subcategoryId: this.props.subcategoryId,
            categoryMap: this.props.categoryMap,
            subcategoryMap: categoryId !== 0 ? this.props.categoryMap.get(categoryId).subcategoryMap : new Map(),
        });
    }

    submitCategory() {
        this.toggle();

        this.props.handleCategorySelect(this.state.categoryId, this.state.subcategoryId);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    shortenString(str) {
        if (str.length > 38) {
            return "..." + str.substring(str.length - 38, str.length);
        }
        return str;
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col md={{ size: 12, offset: 1 }}>
                        <Translate>
                            {
                                ({ translate }) =>
                                    <div>
                                        <Row className={classes.CategoriesSelect}>
                                            <Col md={{ size: 10 }} className={classNames("d-flex align-items-center", classes.CategoryText)}>
                                                {
                                                    this.shortenString(
                                                        (this.props.categoryId === 0 ? translate("categorySelect.allCategories") : this.props.categoryMap.get(this.props.categoryId).name)
                                                        + ">" +
                                                        (this.props.subcategoryId === 0 ? translate("categorySelect.allSubCategories") : this.props.categoryMap.get(this.props.categoryId).subcategoryMap.get(this.props.subcategoryId).name)
                                                    )
                                                }
                                            </Col>
                                            <Col md={{ size: 2 }} className={classes.Button}>
                                                <Button 
                                                    className={classNames(colors.primaryColor, "float-left")} 
                                                    onClick={this.openCategorySelectModal} 
                                                    size="sm">
                                                    <FaEdit />
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Modal isOpen={this.state.modal} toggle={this.toggle} size="lg">
                                            <ModalHeader toggle={this.toggle}><Translate id="categorySelect.chooseCategory" /></ModalHeader>
                                            <ModalBody>
                                                <Row>
                                                    <Col md={{ size: 6, order: 0, offset: 0 }}>
                                                        <ListGroup className={classes.ListGroup}>
                                                            <ListGroupItem
                                                                active={this.state.categoryId === 0}
                                                                onClick={() => this.categorySelected(0)}
                                                                className="justify-content-between">
                                                                <Translate id="categorySelect.allCategories" />
                                                            </ListGroupItem>
                                                            {
                                                                Array.from(this.state.categoryMap).map((category) => (
                                                                    <ListGroupItem
                                                                        key={category[0]}
                                                                        active={this.state.categoryId === category[0]}
                                                                        onClick={() => this.categorySelected(category[0])}
                                                                        className="justify-content-between">
                                                                        {category[1].name}
                                                                        <Badge pill className={classes.Badge}>{category[1].subcategoryMap.size}</Badge>
                                                                    </ListGroupItem>
                                                                ))
                                                            }
                                                        </ListGroup>
                                                    </Col>
                                                    <Col md={{ size: 6, order: 0, offset: 0 }}>
                                                        <ListGroup className={classes.ListGroup}>
                                                            <ListGroupItem
                                                                active={this.state.subcategoryId === 0}
                                                                onClick={() => this.subcategorySelected(0)}
                                                                className="justify-content-between">
                                                                <Translate id="categorySelect.allSubCategories" />
                                                            </ListGroupItem>
                                                            {
                                                                Array.from(this.state.subcategoryMap).map((category, i) => (
                                                                    <ListGroupItem
                                                                        key={category[0]}
                                                                        active={this.state.subcategoryId === category[0]}
                                                                        onClick={() => this.subcategorySelected(category[0])}
                                                                        className="justify-content-between">
                                                                        {category[1].name}
                                                                    </ListGroupItem>
                                                                ))
                                                            }
                                                        </ListGroup>
                                                    </Col>
                                                </Row>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button className={colors.primaryColor} onClick={this.submitCategory}><Translate id="button.submit" /></Button>
                                                <Button color="secondary" onClick={this.toggle}><Translate id="button.cancel" /></Button>
                                            </ModalFooter>
                                        </Modal>
                                    </div>
                            }
                        </Translate>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default CategorySelect;