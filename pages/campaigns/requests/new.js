const { Form, Button, Message } = require("semantic-ui-react");
import Layout from '../../../components/Layout';
import React, { Component } from 'react';
import Campaign from '../../../ethereum/campaign'
import web3 from '../../../ethereum/web3';
import { Link } from '../../../routes';

class NewRequest extends Component {
    static async getInitialProps(props) {
        const { address} = props.query;
        return { address };
    }

    state = {
        amount: '',
        description: '',
        recipient: '',
        errorMessage: '',
        isLoading: false,
        isError: false,
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({ isLoading: true, isError: false });
        console.log(this.props.address);
        const campaign = Campaign(this.props.address);
        const { description, amount, recipient } = this.state;
        console.log(recipient);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(description, web3.utils.toWei(amount, 'ether'), recipient).send(
                { from: accounts[0] }
            );
            // Router.pushRoute('/');
        }catch(e) {
            this.setState({ errorMessage: e.message, isError: true});
        }
        this.setState({ isLoading: false });
    }
   
    render() {
        return (
            <div>
                <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                        <a>Go Back</a>
                    </a>
                </Link>
                <h3>Create A Request</h3>
                <Form onSubmit={this.onSubmit} error={this.state.isError}>
                    <Form.Field>
                        <label>Description</label>
                        <input placeholder='Request Description' value={this.state.description}
                        onChange={event => this.setState({description: event.target.value})}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Amount In Ether</label>
                        <input label='wei' labelPosition='right' placeholder='Ex. - 10' value={this.state.amount}
                        onChange={event => this.setState({amount: event.target.value})}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <input placeholder='Recipient Address' value={this.state.recipient}
                        onChange={event => this.setState({recipient: event.target.value})}/>
                    </Form.Field>
                    <Button secondary loading={this.state.isLoading}>Create Request</Button>
                    <Message error='true' header='Oops!' content = {this.state.errorMessage}></Message>
                </Form>
                </Layout>
            </div>
        );
    }
}

export default NewRequest;