import React from 'react';
import { Translate } from "react-localize-redux";
import { Container, Row, Col, InputGroup, Input, Button } from 'reactstrap';
import { FaSearch } from 'react-icons/fa';
import classNames from 'classnames';
import colors from '../../../css/colors.css';
import classes from './SearchField.css';

class SearchField extends React.Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col md={{ size: 12, offset: 1 }}>
                        <Row>
                            <Col md={{ size: 10 }} className={classes.SearchField}>
                                <Translate>
                                    {
                                        ({ translate }) =>
                                            <InputGroup size="sm">
                                                <Input
                                                    type="text"
                                                    onChange={this.props.handleSearch}
                                                    onKeyPress={this.props.handleKeyPressSearch}
                                                    value={this.props.searchTerm}
                                                    placeholder={translate("searchField.placeholder")}  
                                                />
                                            </InputGroup>
                                    }
                                </Translate>
                            </Col>
                            <Col md={{ size: 2 }} className={classes.Button}>
                                <Button
                                    className={classNames(colors.primaryColor, "float-left")}
                                    onClick={this.props.handleSubmitSearch}
                                    size="sm">
                                    <FaSearch />
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default SearchField;