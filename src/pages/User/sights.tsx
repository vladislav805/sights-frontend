import * as React from 'react';
import './sights.scss';
import LoadingWrapper from '../../components/LoadingWrapper';
import API, { ISight, IUser, List } from '../../api';
import SightsGallery from '../../components/SightsGallery/SightsGallery';

interface ISightsOfUserProps {
    user: IUser;
}

interface ISightsOfUserState {
    data: List<ISight>;
}

class SightsOfUser extends React.Component<ISightsOfUserProps, ISightsOfUserState> {
    state: ISightsOfUserState = {
        data: undefined,
    };

    componentDidMount() {
        this.fetchList(0);
    }

    private fetchList = async(offset: number) => {
        const { count, items } = await API.sights.getOwns(this.props.user.userId, 30, offset);

        this.setState(({ data }) => ({
            data: {
                count,
                items: (data ? data.items : []).concat(items),
            }
        }));
    };

    private next = () => {
        this.fetchList(this.state.data.items.length);
    };

    render() {
        const { data } = this.state;
        return (
            <LoadingWrapper
                loading={!data}
                render={() => <SightsGallery data={data} next={this.next} />} />
        );
    }
}

export default SightsOfUser;
