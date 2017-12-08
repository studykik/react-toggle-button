/* eslint-disable react/prefer-stateless-function */
/* eslint-disable prefer-template */

import React, { PropTypes } from 'react';
import inViewport from 'in-viewport';
import classNames from 'classnames';
import Remarkable from 'remarkable';
import * as Scroll from 'react-scroll';
import SocialArea from '../SocialArea';

const scroll = Scroll.animateScroll;
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

  scrollToTop() {
    const options = {
      duration: 500,
    };
    scroll.scrollTo(0, options);
  }

  render() {
    const { landing } = this.props;
    const md = new Remarkable();
    const imgSrc = (landing && landing.imgSrc) ? landing.imgSrc : null;
    const dataView = (imgSrc) ? 'slideInRight' : 'fadeInUp';
    const indication = landing.indication;
    const siteName = landing.siteName;

    let preview =
      (<div className="img-holder">
        <img src={imgSrc} width="854" height="444" alt="preview" className="img-responsive" />
      </div>);

    if (imgSrc) {
      const re = /(?:\.([^.]+))?$/;
      const ext = re.exec(imgSrc)[1];

      if (ext === 'pdf') {
        preview =
          (<div className="img-holder pdf">
            <object data={`${imgSrc}?#zoom=scale&scrollbar=1&toolbar=0&view=Fit`} width="100%" height="100%" type="application/pdf">
              <embed src={`${imgSrc}?#zoom=scale&scrollbar=1&toolbar=0&view=Fit`} width="100%" height="100%" type="application/pdf" />
            </object>
          </div>);
      }
    }

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
      'By signing up you agree to receive text messages and emails about this and similar studies near you. ' +
      'You can unsubscribe at any time. Text messages and data rates may apply. Refer to Privacy Policy.';
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
            <p className="instruction text-underline" onClick={this.scrollToTop}>
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
              preview
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
