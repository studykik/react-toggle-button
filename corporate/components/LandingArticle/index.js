/* eslint-disable react/prefer-stateless-function */
/* eslint-disable prefer-template */

import React, { PropTypes } from 'react';
import inViewport from 'in-viewport';
import classNames from 'classnames';
import Remarkable from 'remarkable';

import SocialArea from '../SocialArea';

export class LandingArticle extends React.Component {

  static propTypes = {
    landing: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.watcherA = null;
    this.watcherB = null;

    this.setVisible = this.setVisible.bind(this);
  }

  componentDidMount() {
    this.watcherA = inViewport(this.slideInLeft, this.setVisible);
    this.watcherB = inViewport(this.slideInRight, this.setVisible);
  }

  componentWillUnmount() {
    this.watcherA.dispose();
    this.watcherB.dispose();
  }

  setVisible(el) {
    const viewAtr = el.getAttribute('data-view');
    el.classList.add('in-viewport', viewAtr);
  }

  render() {
    const { landing } = this.props;
    const md = new Remarkable();
    const imgSrc = (landing && landing.imgSrc) ? landing.imgSrc : null;
    const dataView = (imgSrc) ? 'slideInRight' : 'fadeInUp';
    const indication = landing.indication;
    const siteName = landing.siteName;

    const landingDescription = (landing && landing.description && landing.description !== 'seed') ? landing.description : null;

    let address = landing.address;
    const city = landing.city;
    const state = landing.state;
    const zip = landing.zip;

    if (city) {
      address += ', ' + city;
    }

    if (state) {
      address += ', ' + state;
    }

    if (zip) {
      address += ', ' + zip;
    }

    md.set({
      html: true,
      breaks: true,
    });

    const markdown = md.render(landingDescription);

    const bySignUpText = (landing.bySignUpText) ? landing.bySignUpText :
      'By providing my personal information to StudyKIK, I explicitly consent to StudyKIK sharing my personal information with participating clinical trial sites and to such ' +
      'entities contacting me by Text message, email, & phone call for purposes of possible participation in clinical trials. ' +
      'Text messages and data rates may apply.';
    const ifInterestedInstructions = (landing.ifInterestedInstructions) ? landing.ifInterestedInstructions :
      'If interested, enter information above to sign up!';

    return (
      <article className="landing post">
        <div className="row">
          <div
            ref={(slideInRight) => { this.slideInRight = slideInRight; }}
            className={classNames({ 'col-xs-12 col-sm-6 pull-right': imgSrc, centered: !imgSrc })}
            data-view={dataView}
          >
            {!landingDescription &&
              <h2 className={classNames({ nodesc: !landingDescription })}>
                {indication}
              </h2>
            }
            {landingDescription &&
              <div className="custom-description" dangerouslySetInnerHTML={{ __html: markdown }} />
            }
            {!landingDescription &&
              <div>
                <strong className="title text-uppercase">{siteName}</strong>
                <address>{address}</address>
              </div>
            }
            <p className="text-underline">
              {ifInterestedInstructions}
            </p>
            <p className="note">
              {bySignUpText}
            </p>
            {!imgSrc &&
              <SocialArea alignCenter {...this.props} imgSrc={imgSrc} />
            }
          </div>
          <div
            ref={(slideInLeft) => { this.slideInLeft = slideInLeft; }}
            className="col-xs-12 col-sm-6"
            data-view="slideInLeft"
          >
            {imgSrc &&
              <div className="img-holder">
                <img src={imgSrc} width="854" height="444" alt="preview" className="img-responsive" />
              </div>
            }
            {imgSrc &&
              <SocialArea {...this.props} imgSrc={imgSrc} />
            }
          </div>
        </div>
      </article>
    );
  }
}

export default LandingArticle;
