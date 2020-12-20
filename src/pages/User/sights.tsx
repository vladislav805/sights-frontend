import * as React from 'react';
import LoadingWrapper from '../../components/LoadingWrapper';
import API, { ISight, IUser, IApiList } from '../../api';
import SightsGallery from '../../components/SightsGallery/SightsGallery';
import { genderize } from '../../utils';

interface ISightsOfUserProps {
    user: IUser;
}

interface ISightsOfUserState {
    data: IApiList<ISight>;
}

class SightsOfUser extends React.Component<ISightsOfUserProps, ISightsOfUserState> {
    state: ISightsOfUserState = {
        data: undefined,
    };

    componentDidMount(): void {
        void this.fetchList(0);
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

    private next = () => this.fetchList(this.state.data.items.length);

    private renderGallery = () => {
        return (
            <SightsGallery
                data={this.state.data}
                next={this.next}
                whenNothing={this.onNothingShow}/>
        );
    };

    private onNothingShow = () => {
        const user = this.props.user;
        return (
            <div className="profile-sightGallery__empty">{user.firstName} ничего не {genderize(user, 'добавлял', 'добавляла')}</div>
        );
    };

    render(): JSX.Element {

        return (
            <LoadingWrapper
                loading={!this.state.data}
                render={this.renderGallery} />
        );
    }
}

export default SightsOfUser;
