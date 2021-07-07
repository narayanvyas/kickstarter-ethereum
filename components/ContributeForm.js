const { Form, Button, Message, Input } = require("semantic-ui-react");
const { default: Layout } = require("./Layout");
import React, { Component } from 'react';
import web3 from '../ethereum/web3';
import { Router} from '../routes';
import Campaign from '../ethereum/campaign';

class ContributeForm extends Component {
    state = {
        value: '',
        errorMessage: '',
        isLoading: false,
        isError: false,
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({ isLoading: true, isError: false });
        try {
            const campaign = Campaign(this.props.address);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
            Router.replaceRoute(`/campaigns/${this.props.address}`);
        }catch(e) {
            this.setState({ errorMessage: e.message, isError: true});
        }
        this.setState({ isLoading: false });
    }
    render() {
        return (<div>
            <h3>Contribute</h3>
            <Form onSubmit={this.onSubmit} error={this.state.isError}>
                <Form.Field>
                    <label>Contribute Money</label>
                    <Input label='Ether' labelPosition='right' placeholder='Ex. - 10000' value={this.state.value}
                    onChange={event => this.setState({value: event.target.value})} />
                </Form.Field>
                <Button secondary loading={this.state.isLoading}>Contribute</Button>
                <Message error='true' header='Oops!' content = {this.state.errorMessage}></Message>
            </Form>
        </div>);
    }
}

export default ContributeForm;