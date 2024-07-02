import {Component} from 'react'
import {IoIosStar} from 'react-icons/io'
import {MdLocationOn} from 'react-icons/md'
import {AiFillContacts} from 'react-icons/ai'
import {HiOutlineExternalLink} from 'react-icons/hi'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const apinContants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class JobItemDetails extends Component {
  state = {
    similarJobList: [],
    jobDetails: [],
    lifeAtCompany: [],
    skillsData: [],
    apiStatus: apinContants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apinContants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()

    const formatSimilarJobs = data.similar_jobs.map(each => ({
      similarCompanyLogoUrl: each.company_logo_url,
      similarEmploymentType: each.employment_type,
      similarId: each.id,
      similarJobDescription: each.job_description,
      similarLocation: each.location,
      similarRating: each.rating,
      similarTitle: each.title,
    }))

    const jobDetails = data.job_details

    const formattedJobDetails = {
      companyLogoUrl: jobDetails.company_logo_url,
      companyWebsiteUrl: jobDetails.company_website_url,
      employmentType: jobDetails.employment_type,
      id: jobDetails.id,
      jobDescription: jobDetails.job_description,
      location: jobDetails.location,
      packagePerAnnum: jobDetails.package_per_annum,
      rating: jobDetails.rating,
      title: jobDetails.title,
    }

    const formatLifeAtCompany = {
      description: jobDetails.life_at_company.description,
      imageUrl: jobDetails.life_at_company.image_url,
    }

    const formatSkillData = jobDetails.skills.map(each => ({
      skilledImageUrl: each.image_url,
      name: each.name,
    }))

    if (response.ok === true) {
      this.setState({
        similarJobList: formatSimilarJobs,
        jobDetails: formattedJobDetails,
        lifeAtCompany: formatLifeAtCompany,
        skillsData: formatSkillData,
        apiStatus: apinContants.success,
      })
    } else if (response.status === 401) {
      this.setState({apiStatus: apinContants.failure})
    } else {
      this.setState({apiStatus: apinContants.failure})
    }
  }

  onLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onFailureView = () => {
    const refreshPage = () => {}
    return (
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="failure-image"
        />
        <h1 className="failure-heading">Oops! Something Went Wrong</h1>
        <p className="failure-description">
          We cannot seem to find the page you are looking for
        </p>
        <button className="failure-button" onClick={refreshPage} type="button">
          Retry
        </button>
      </div>
    )
  }

  getSimilarDetailsCards = () => {
    const {similarJobList} = this.state
    return (
      <div className="similar-container">
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-cards-container">
          {similarJobList.map(each => (
            <li className="similar-job-card-container" key={each.similarId}>
              <div className="similar-company-logo-container">
                <img
                  src={each.similarCompanyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <div>
                  <h1 className="similar-title">{each.similarTitle}</h1>
                  <div className="similar-rating-conatiner">
                    <IoIosStar className="similar-star-icon" />
                    <p className="similar-rating">{each.similarRating}</p>
                  </div>
                </div>
              </div>
              <div className="similar-location-salary-container">
                <div className="similar-location-container">
                  <div className="similar-location-container">
                    <MdLocationOn className="location-icon" />
                    <p className="similar-location">{each.similarLocation}</p>
                  </div>
                  <div className="similar-location-container">
                    <AiFillContacts className="location-icon" />

                    <p className="similar-location">
                      {each.similarEmploymentType}
                    </p>
                  </div>
                </div>
              </div>

              <h1 className="similar-description-heading">Description</h1>
              <p className="similar-description-description">
                {each.similarJobDescription}
              </p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  getSkillsListDetails = () => {
    const {skillsData} = this.state

    return (
      <ul className="skills-item-container">
        {skillsData.map(each => (
          <li className="skills-container">
            <img
              src={each.skilledImageUrl}
              alt={each.name}
              className="skills-img"
            />
            <p className="skills-name">{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  getLifeDetails = () => {
    const {lifeAtCompany} = this.state
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="life-company-details-container">
        <div className="life-description-container">
          <h1 className="life-company-heading">Life at Company</h1>
          <p className="life-company-description">{description}</p>
        </div>
        <div>
          <img
            src={imageUrl}
            alt="life at company"
            className="life-company-image"
          />
        </div>
      </div>
    )
  }

  getJobItemDetails = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      rating,
      title,
      packagePerAnnum,
      companyWebsiteUrl,
    } = jobDetails
    return (
      <ul>
        <li className="job-card-item-container" key={id}>
          <div className="card-company-logo-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="card-company-logo"
            />
            <div>
              <h1 className="card-item-title">{title}</h1>
              <div className="card-rating-conatiner">
                <IoIosStar className="card-star-icon" />
                <p className="card-rating">{rating}</p>
              </div>
            </div>
          </div>

          <div className="card-location-salary-container">
            <div className="card-location-container">
              <div className="card-location-container">
                <MdLocationOn className="card-location-icon" />
                <p className="card-location">{location}</p>
              </div>
              <div className="card-location-container">
                <AiFillContacts className="card-location-icon" />
                <p className="card-location">{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>

          <hr className="card-hr-card-line" />
          <div className="visit-container">
            <h1 className="card-description-heading">Description</h1>
            <a href={companyWebsiteUrl} className="visit">
              Visit <HiOutlineExternalLink />
            </a>
          </div>
          <p className="card-description-description">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          {this.getSkillsListDetails()}
          {this.getLifeDetails()}
        </li>

        {this.getSimilarDetailsCards()}
      </ul>
    )
  }

  switchTodisplayPage = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apinContants.failure:
        return this.onFailureView()
      case apinContants.inProgress:
        return this.onLoadingView()
      case apinContants.success:
        return this.getJobItemDetails()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-item-details-container">
        <Header />
        <div className="job-container-section">
          {this.switchTodisplayPage()}
        </div>
      </div>
    )
  }
}

export default JobItemDetails
