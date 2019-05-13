import React, {Component} from 'react';
import Select from 'react-select/lib/Creatable';
import Skill from './Skill';

const GET_SKILL = 'http://127.0.0.1:3000/getSkillDetail';

class CategorySkill extends Component {
    constructor(props) {
        super(props);
        this.state = {
            skillOptions: [],
        };
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.removeCategory = this.removeCategory.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.indexUpward = this.indexUpward.bind(this);
        this.indexDownward = this.indexDownward.bind(this);
    }

    componentDidMount() {
        fetch(GET_SKILL).then((res) => {
            res.json().then((value) => {
                this.setState({
                    skillOptions: value.map((opt) => opt)
                });
            });
        });
    }

    indexUpward() {
        let changeIndex = this.props.id - 1;
        this.props.handleCategoryIndexChangeUpward(this.props.id, changeIndex)
    }

    indexDownward() {
        let changeIndex = this.props.id + 1;
        this.props.handleCategoryIndexChangeDownward(this.props.id, changeIndex)
    }

    addSkill() {
        this.props.addSkill(this.props.id);
    }

    removeCategory() {
        this.props.removeCategory(this.props.id);
    }

    handleCategoryChange(opt) {
        const value = opt === null ? '' : opt.value;
        const label = opt === null ? '' : opt.label;
        this.props.handleChanges(this.props.id, value, label);

    }

    render() {
        if (this.props.indexDownward) {
            return (
                <div>
                    <div className="btn-group float-right mt-2" role="group">
                        <a className="btn btn-primary btn-md" onClick={this.removeCategory}>x</a>
                    </div>
                    <div className='row'>
                        <div className='col-md-4 col-lg-4 col-sm-12'>
                            <button type='button' className="button-change-index fas fa-sort-down"
                                    onClick={this.indexDownward}/>
                            <h3 className="inline">Category</h3>
                            <Select defaultValue={{value: this.props.value.category, label: this.props.value.label}}
                                    options={this.props.options}
                                    isClearable={true}
                                    onChange={this.handleCategoryChange}
                                    captureMenuScroll={false}
                                    isOptionSelected={(obj) => {
                                        return obj.value === this.props.value.category;
                                    }}
                            />
                        </div>
                    </div>
                    <div className='top'>
                        <button type="submit" className="btn btn-primary btn-primary" onClick={this.addSkill}>+Add
                            Skill
                        </button>
                    </div>
                    <div>
                        {
                            this.props.value.skills.map((value, index) => {
                                if(index === 0){
                                    return(<Skill key={Math.random()} skillId={index} value={value}
                                                  options={this.state.skillOptions}
                                                  removeSkill={this.props.removeSkill}
                                                  categoryId={this.props.id} handleSkillChanges={this.props.handleSkillChanges}
                                                  handleSkillIndexChangeUpward={this.props.handleSkillIndexChangeUpward}
                                                  handleSkillIndexChangeDownward={this.props.handleSkillIndexChangeDownward}
                                                  indexDownward={true}
                                    />)
                                }
                                else if(index > 0 && index === this.props.value.skills.length - 1){
                                    return(<Skill key={Math.random()} skillId={index} value={value}
                                                  options={this.state.skillOptions}
                                                  removeSkill={this.props.removeSkill}
                                                  categoryId={this.props.id} handleSkillChanges={this.props.handleSkillChanges}
                                                  handleSkillIndexChangeUpward={this.props.handleSkillIndexChangeUpward}
                                                  handleSkillIndexChangeDownward={this.props.handleSkillIndexChangeDownward}
                                                  indexUpward={true}
                                    />)
                                } else if(index > 0) {
                                    return(<Skill key={Math.random()} skillId={index} value={value}
                                                  options={this.state.skillOptions}
                                                  removeSkill={this.props.removeSkill}
                                                  categoryId={this.props.id} handleSkillChanges={this.props.handleSkillChanges}
                                                  handleSkillIndexChangeUpward={this.props.handleSkillIndexChangeUpward}
                                                  handleSkillIndexChangeDownward={this.props.handleSkillIndexChangeDownward}
                                                  bothIndex={true}
                                    />)
                                }
                            })
                        }
                    </div>
                </div>
            );
        }
        else if (this.props.indexUpward) {
            return (
                <div>
                    <div className="btn-group float-right mt-2" role="group">
                        <a className="btn btn-primary btn-md" onClick={this.removeCategory}>x</a>
                    </div>
                    <div className='row'>
                        <div className='col-md-4 col-lg-4 col-sm-12'>
                            <button type='button' className="button-change-index fas fa-sort-up"
                                    onClick={this.indexUpward}/>
                            <h3 className="inline">Category</h3>
                            <Select defaultValue={{value: this.props.value.category, label: this.props.value.label}}
                                    options={this.props.options}
                                    isClearable={true}
                                    onChange={this.handleCategoryChange}
                                    captureMenuScroll={false}
                                    isOptionSelected={(obj) => {
                                        return obj.value === this.props.value.category;
                                    }}
                            />
                        </div>
                    </div>
                    <div className='top'>
                        <button type="submit" className="btn btn-primary btn-primary" onClick={this.addSkill}>+Add
                            Skill
                        </button>
                    </div>
                    <div>
                        {
                            this.props.value.skills.map((value, index) => {
                                if(index === 0){
                                    return(<Skill key={Math.random()} skillId={index} value={value}
                                                  options={this.state.skillOptions}
                                                  removeSkill={this.props.removeSkill}
                                                  categoryId={this.props.id} handleSkillChanges={this.props.handleSkillChanges}
                                                  handleSkillIndexChangeUpward={this.props.handleSkillIndexChangeUpward}
                                                  handleSkillIndexChangeDownward={this.props.handleSkillIndexChangeDownward}
                                                  indexDownward={true}
                                    />)
                                }
                                else if(index > 0 && index === this.props.value.skills.length - 1){
                                    return(<Skill key={Math.random()} skillId={index} value={value}
                                                  options={this.state.skillOptions}
                                                  removeSkill={this.props.removeSkill}
                                                  categoryId={this.props.id} handleSkillChanges={this.props.handleSkillChanges}
                                                  handleSkillIndexChangeUpward={this.props.handleSkillIndexChangeUpward}
                                                  handleSkillIndexChangeDownward={this.props.handleSkillIndexChangeDownward}
                                                  indexUpward={true}
                                    />)
                                } else if(index > 0) {
                                    return(<Skill key={Math.random()} skillId={index} value={value}
                                                  options={this.state.skillOptions}
                                                  removeSkill={this.props.removeSkill}
                                                  categoryId={this.props.id} handleSkillChanges={this.props.handleSkillChanges}
                                                  handleSkillIndexChangeUpward={this.props.handleSkillIndexChangeUpward}
                                                  handleSkillIndexChangeDownward={this.props.handleSkillIndexChangeDownward}
                                                  bothIndex={true}
                                    />)
                                }
                            })
                        }
                    </div>
                </div>
            );
        } else if (this.props.bothIndex){
            return (
                <div>
                    <div className="btn-group float-right mt-2" role="group">
                        <a className="btn btn-primary btn-md" onClick={this.removeCategory}>x</a>
                    </div>
                    <div className='row'>
                        <div className='col-md-4 col-lg-4 col-sm-12'>
                            <button type='button' className="button-change-index fas fa-sort-up"
                                    onClick={this.indexUpward}/>
                            <button type='button' className="button-change-index fas fa-sort-down"
                                    onClick={this.indexDownward}/>
                            <h3 className="inline">Category</h3>
                            <Select defaultValue={{value: this.props.value.category, label: this.props.value.label}}
                                    options={this.props.options}
                                    isClearable={true}
                                    onChange={this.handleCategoryChange}
                                    captureMenuScroll={false}
                                    isOptionSelected={(obj) => {
                                        return obj.value === this.props.value.category;
                                    }}
                            />
                        </div>
                    </div>
                    <div className='top'>
                        <button type="submit" className="btn btn-primary btn-primary" onClick={this.addSkill}>+Add
                            Skill
                        </button>
                    </div>
                    <div>
                        {
                            this.props.value.skills.map((value, index) => {
                                if(index === 0){
                                    return(<Skill key={Math.random()} skillId={index} value={value}
                                                  options={this.state.skillOptions}
                                                  removeSkill={this.props.removeSkill}
                                                  categoryId={this.props.id} handleSkillChanges={this.props.handleSkillChanges}
                                                  handleSkillIndexChangeUpward={this.props.handleSkillIndexChangeUpward}
                                                  handleSkillIndexChangeDownward={this.props.handleSkillIndexChangeDownward}
                                                  indexDownward={true}
                                    />)
                                }
                                else if(index > 0 && index === this.props.value.skills.length - 1){
                                    return(<Skill key={Math.random()} skillId={index} value={value}
                                                  options={this.state.skillOptions}
                                                  removeSkill={this.props.removeSkill}
                                                  categoryId={this.props.id} handleSkillChanges={this.props.handleSkillChanges}
                                                  handleSkillIndexChangeUpward={this.props.handleSkillIndexChangeUpward}
                                                  handleSkillIndexChangeDownward={this.props.handleSkillIndexChangeDownward}
                                                  indexUpward={true}
                                    />)
                                } else if(index > 0) {
                                    return(<Skill key={Math.random()} skillId={index} value={value}
                                                  options={this.state.skillOptions}
                                                  removeSkill={this.props.removeSkill}
                                                  categoryId={this.props.id} handleSkillChanges={this.props.handleSkillChanges}
                                                  handleSkillIndexChangeUpward={this.props.handleSkillIndexChangeUpward}
                                                  handleSkillIndexChangeDownward={this.props.handleSkillIndexChangeDownward}
                                                  bothIndex={true}
                                    />)
                                }
                            })
                        }
                    </div>
                </div>
            );

        }
    }
}

export default CategorySkill;