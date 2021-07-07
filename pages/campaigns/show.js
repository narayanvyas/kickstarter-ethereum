import React, { Component } from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        return {
            'address': props.query.address,
            'minimumContribution': summary[0],
            'balance': summary[1],
            'requests': summary[2],
            'approversCount': summary[3],
            'manager': summary[4],
        };
    }

    renderCards() {
        const {
            balance,
            manager,
            minimumContribution,
            requests,
            approversCount
        } = this.props;


        const items = [
            {
                header: manager,
                meta: 'Address Of The Manager',
                description: 'Manager created this campaign and can request to withdraw money',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution Required (wei)',
                description: 'This is the minimum contribution amount required for this campaign',
                style: { overflowWrap: 'break-work' }
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (Ether)',
                description: 'Total Balance Of This Campaign',
                style: { overflowWrap: 'break-work' }
            },
            {
                header: requests,
                meta: 'Total Requests',
                description: 'Total Number Of Requests For This Campaign',
                style: { overflowWrap: 'break-work' }
            },
            {
                header: approversCount,
                meta: 'Approvers',
                description: 'Total Number Of Approvers For This Campaign',
                style: { overflowWrap: 'break-work' }
            }
        ]

        return <Card.Group items={items} />
    }

    render() {
        return (
            <Layout>
                <h3>Campaign Details</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}><ContributeForm address={this.props.address} /></Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button secondary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;