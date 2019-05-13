import React, {Component} from 'react';
import Select from "react-select/lib/Creatable";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';


class Skill extends Component {
    constructor(props) {
        super(props);
        this.state = {

            items: '',
            experienceMax: 50,
            experienceMin: 0,
            skillMax: 10,
            skillMin: 0,
            interestMax: 10,
            interestMin: 0,
            step: .5,
            experienceValue: this.props.value.experience,
            skillRating: this.props.value.rating,
            interestValue: this.props.value.interest,
            comment: this.props.value.comment
        };
        this.handleSkillChange = this.handleSkillChange.bind(this);
        this.handleExperienceOnChange = this.handleExperienceOnChange.bind(this);
        this.handleSelfRatingOnChange = this.handleSelfRatingOnChange.bind(this);
        this.handleInterestOnChange = this.handleInterestOnChange.bind(this);
        this.removeSkill = this.removeSkill.bind(this);
        this.handleSelfRatingOnAfterChange = this.handleSelfRatingOnAfterChange.bind(this);
        this.handleExperienceOnAfterChange = this.handleExperienceOnAfterChange.bind(this);
        this.handleInterestOnAfterChange = this.handleInterestOnAfterChange.bind(this);
        this.handleCommentOnBlur = this.handleCommentOnBlur.bind(this);
        this.handleCommentOnChange = this.handleCommentOnChange.bind(this);
        this.indexUpward = this.indexUpward.bind(this);
        this.indexDownward = this.indexDownward.bind(this)
    }
    indexUpward(){
        let changeIndex = this.props.skillId - 1;
        this.props.handleSkillIndexChangeUpward(this.props.categoryId, this.props.skillId, changeIndex)
    }
    indexDownward(){
        let changeIndex = this.props.skillId + 1;
        this.props.handleSkillIndexChangeDownward(this.props.categoryId, this.props.skillId, changeIndex)
    }
    removeSkill() {
        this.props.removeSkill(this.props.categoryId, this.props.skillId)
    }

    handleSkillChange(opt) {
        const value = opt === null ? '' : opt.value;
        const label = opt === null ? '' : opt.label;
        let sendSkillName = this.props.value;
        sendSkillName.skill = value;
        sendSkillName.skillLabel = label;
        this.props.handleSkillChanges(this.props.categoryId, this.props.skillId, sendSkillName)
    }

    handleSelfRatingOnChange(value) {
        this.setState({
            skillRating: value
        });
    }

    handleSelfRatingOnAfterChange(value) {
        let skillRating = this.props.value;
        skillRating.rating = value;
        this.props.handleSkillChanges(this.props.categoryId, this.props.skillId, skillRating);
    }

    handleExperienceOnChange(value) {
        this.setState({
            experienceValue: value
        })
    }

    handleExperienceOnAfterChange(value) {
        let experience = this.props.value;
        experience.experience = value;
        this.props.handleSkillChanges(this.props.categoryId, this.props.skillId, experience);
    }

    handleInterestOnChange(value) {
        this.setState({
            interestValue: value
        })
    }

    handleInterestOnAfterChange(value) {
        let interest = this.props.value;
        interest.interest = value;
        this.props.handleSkillChanges(this.props.categoryId, this.props.skillId, interest);
    }

    handleCommentOnChange(e) {
        this.setState({
            comment: e.target.value
        })
    }

    handleCommentOnBlur(e) {
        let comment = this.props.value;
        comment.comment = e.target.value;
        this.props.handleSkillChanges(this.props.categoryId, this.props.skillId, comment);
    }

    render() {
        if(this.props.bothIndex){
            return (
                <div>
                    <div className="item">
                        <div className="btn-group float-right mt-2" role="group">
                            <a className="btn btn-primary btn-md" onClick={this.removeSkill}>x</a>
                        </div>
                        <div className='row'>

                            <div className='col-md-3 col-lg-3 col-sm-12'>
                                <button type='button' className="button-change-index fas fa-sort-up" onClick={this.indexUpward}/>
                                <button type='button' className="button-change-index fas fa-sort-down" onClick={this.indexDownward}/>
                                <h3 className="inline">Skills</h3>
                                <Select
                                    defaultValue={{
                                        value: this.props.value.skill,
                                        label: this.props.value.skillLabel
                                    }}
                                    options={this.props.options}
                                    isClearable={true}
                                    captureMenuScroll={false}
                                    onChange={this.handleSkillChange}
                                    isOptionSelected={(obj) => {
                                        return obj.value === this.props.value.skill;
                                    }}
                                />
                            </div>
                            <div className='col-md-3 col-lg-3 col-sm-12'>
                                <h3 className="centerBlock">Self-Rating</h3>
                                <Slider
                                    min={this.state.skillMin}
                                    max={this.state.skillMax}
                                    step={this.state.step}
                                    defaultValue={this.props.value.rating}
                                    onChange={this.handleSelfRatingOnChange}
                                    onAfterChange={this.handleSelfRatingOnAfterChange}
                                />
                                <p>Value: {this.state.skillRating}</p>
                            </div>
                            <div className='col-md-3 col-lg-3 col-sm-12'>
                                <h3 className="centerBlock">Experience</h3>
                                <Slider
                                    max={this.state.experienceMax}
                                    min={this.state.experienceMin}
                                    defaultValue={this.props.value.experience}
                                    onChange={this.handleExperienceOnChange}
                                    onAfterChange={this.handleExperienceOnAfterChange}
                                />
                                <p>Value: {this.state.experienceValue}</p>
                            </div>
                            <div className='col-md-3 col-lg-3 col-sm-12'>
                                <h3 className="centerBlock">Interest</h3>
                                <Slider
                                    max={this.state.interestMax}
                                    min={this.state.interestMin}
                                    step={this.state.step}
                                    defaultValue={this.props.value.interest}
                                    onChange={this.handleInterestOnChange}
                                    onAfterChange={this.handleInterestOnAfterChange}
                                />
                                <p>Value: {this.state.interestValue}</p>
                            </div>
                        </div>
                        <div className="row top">
                            <div className="col-md-12 col-lg-12">
                                <h3>Comment</h3>
                                <textarea rows={5} className="fullWidth" value={this.state.comment}
                                          onChange={this.handleCommentOnChange}
                                          onBlur={this.handleCommentOnBlur}/>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else if(this.props.indexDownward){
            return (
                <div>
                    <div className="item">
                        <div className="btn-group float-right mt-2" role="group">
                            <a className="btn btn-primary btn-md" onClick={this.removeSkill}>x</a>
                        </div>
                        <div className='row'>

                            <div className='col-md-3 col-lg-3 col-sm-12'>
                                <button type='button' className="button-change-index fas fa-sort-down" onClick={this.indexDownward}/>
                                <h3 className="inline">Skills</h3>
                                <Select
                                    defaultValue={{
                                        value: this.props.value.skill,
                                        label: this.props.value.skillLabel
                                    }}
                                    options={this.props.options}
                                    isClearable={true}
                                    captureMenuScroll={false}
                                    onChange={this.handleSkillChange}
                                    isOptionSelected={(obj) => {
                                        return obj.value === this.props.value.skill;
                                    }}
                                />
                            </div>
                            <div className='col-md-3 col-lg-3 col-sm-12'>
                                <h3 className="centerBlock">Self-Rating</h3>
                                <Slider
                                    min={this.state.skillMin}
                                    max={this.state.skillMax}
                                    step={this.state.step}
                                    defaultValue={this.props.value.rating}
                                    onChange={this.handleSelfRatingOnChange}
                                    onAfterChange={this.handleSelfRatingOnAfterChange}
                                />
                                <p>Value: {this.state.skillRating}</p>
                            </div>
                            <div className='col-md-3 col-lg-3 col-sm-12'>
                                <h3 className="centerBlock">Experience</h3>
                                <Slider
                                    max={this.state.experienceMax}
                                    min={this.state.experienceMin}
                                    defaultValue={this.props.value.experience}
                                    onChange={this.handleExperienceOnChange}
                                    onAfterChange={this.handleExperienceOnAfterChange}
                                />
                                <p>Value: {this.state.experienceValue}</p>
                            </div>
                            <div className='col-md-3 col-lg-3 col-sm-12'>
                                <h3 className="centerBlock">Interest</h3>
                                <Slider
                                    max={this.state.interestMax}
                                    min={this.state.interestMin}
                                    step={this.state.step}
                                    defaultValue={this.props.value.interest}
                                    onChange={this.handleInterestOnChange}
                                    onAfterChange={this.handleInterestOnAfterChange}
                                />
                                <p>Value: {this.state.interestValue}</p>
                            </div>
                        </div>
                        <div className="row top">
                            <div className="col-md-12 col-lg-12">
                                <h3>Comment</h3>
                                <textarea rows={5} className="fullWidth" value={this.state.comment}
                                          onChange={this.handleCommentOnChange}
                                          onBlur={this.handleCommentOnBlur}/>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else if(this.props.indexUpward){
            return (
                <div>
                    <div className="item">
                        <div className="btn-group float-right mt-2" role="group">
                            <a className="btn btn-primary btn-md" onClick={this.removeSkill}>x</a>
                        </div>
                        <div className='row'>

                            <div className='col-md-3 col-lg-3 col-sm-12'>
                                <button type='button' className="button-change-index fas fa-sort-up" onClick={this.indexUpward}/>
                                <h3 className="inline">Skills</h3>
                                <Select
                                    defaultValue={{
                                        value: this.props.value.skill,
                                        label: this.props.value.skillLabel
                                    }}
                                    options={this.props.options}
                                    isClearable={true}
                                    captureMenuScroll={false}
                                    onChange={this.handleSkillChange}
                                    isOptionSelected={(obj) => {
                                        return obj.value === this.props.value.skill;
                                    }}
                                />
                            </div>
                            <div className='col-md-3 col-lg-3 col-sm-12'>
                                <h3 className="centerBlock">Self-Rating</h3>
                                <Slider
                                    min={this.state.skillMin}
                                    max={this.state.skillMax}
                                    step={this.state.step}
                                    defaultValue={this.props.value.rating}
                                    onChange={this.handleSelfRatingOnChange}
                                    onAfterChange={this.handleSelfRatingOnAfterChange}
                                />
                                <p>Value: {this.state.skillRating}</p>
                            </div>
                            <div className='col-md-3 col-lg-3 col-sm-12'>
                                <h3 className="centerBlock">Experience</h3>
                                <Slider
                                    max={this.state.experienceMax}
                                    min={this.state.experienceMin}
                                    defaultValue={this.props.value.experience}
                                    onChange={this.handleExperienceOnChange}
                                    onAfterChange={this.handleExperienceOnAfterChange}
                                />
                                <p>Value: {this.state.experienceValue}</p>
                            </div>
                            <div className='col-md-3 col-lg-3 col-sm-12'>
                                <h3 className="centerBlock">Interest</h3>
                                <Slider
                                    max={this.state.interestMax}
                                    min={this.state.interestMin}
                                    step={this.state.step}
                                    defaultValue={this.props.value.interest}
                                    onChange={this.handleInterestOnChange}
                                    onAfterChange={this.handleInterestOnAfterChange}
                                />
                                <p>Value: {this.state.interestValue}</p>
                            </div>
                        </div>
                        <div className="row top">
                            <div className="col-md-12 col-lg-12">
                                <h3>Comment</h3>
                                <textarea rows={5} className="fullWidth" value={this.state.comment}
                                          onChange={this.handleCommentOnChange}
                                          onBlur={this.handleCommentOnBlur}/>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Skill;