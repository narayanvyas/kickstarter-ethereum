const { Form, Button, Message } = require("semantic-ui-react");
import Layout from '../../components/Layout';
import React, { Component } from 'react';
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3';
import { Router} from '../../routes';

class NewCampaign extends Component {
    state = {
        minimumContribution: '',
        name: '',
        description: '',
        imageUrl: '',
        errorMessage: '',
        isLoading: false,
        isError: false,
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({ isLoading: true, isError: false });
        try {
            const accounts  = await web3.eth.getAccounts();
            const { minimumContribution, name, description, imageUrl } = this.state;
            await factory.methods.createCampaign(minimumContribution, name, description, imageUrl)
            .send({
                from: accounts[0]
            });

            Router.pushRoute('/');
        }catch(e) {
            this.setState({ errorMessage: e.message, isError: true});
        }
        this.setState({ isLoading: false });
    }
    render() {
        return <Layout><h3>New Campaign</h3>
            <Form onSubmit={this.onSubmit} error={this.state.isError}>
                <Form.Field>
                    <label>Campaign Name</label>
                    <input placeholder='Ex. - Electric Bike' value={this.state.name}
                    onChange={event => this.setState({name: event.target.value})}/>
                </Form.Field>
                <Form.Field>
                    <label>Campaign Description</label>
                    <input placeholder='Ex. - Get Funds For Electric Bike, Win Prize' value={this.state.description}
                    onChange={event => this.setState({description: event.target.value})}/>
                </Form.Field>
                <Form.Field>
                    <label>Minimum Contribution (In Wei)</label>
                    <input label='wei' labelPosition='right' placeholder='Ex. - 10000' value={this.state.minimumContribution}
                    onChange={event => this.setState({minimumContribution: event.target.value})}/>
                </Form.Field>
                <Button secondary loading={this.state.isLoading}>Create</Button>
                <Message error='true' header='Oops!' content = {this.state.errorMessage}></Message>
            </Form>
        </Layout>
    }
}

export default NewCampaign;