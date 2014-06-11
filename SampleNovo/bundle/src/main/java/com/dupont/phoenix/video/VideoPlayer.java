package com.dupont.phoenix.video;

import java.text.Format;
import java.text.SimpleDateFormat;

import javax.jcr.RepositoryException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.PersistableValueMap;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.framework.BundleContext;
import org.osgi.framework.FrameworkUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;
import com.day.cq.dam.commons.util.DateParser;
import com.day.cq.dam.commons.util.UIHelper;
import com.day.cq.dam.scene7.api.Scene7DAMService;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.WCMMode;

public class VideoPlayer {

	/* Static variables */
	private static String MC_TEMPLATE = "mcvideodetail";
	private static final Logger LOGGER = LoggerFactory.getLogger(VideoPlayer.class);
	private static final String FILE_REFERENCE = "fileReference";
	private static final String DAM_SCENE7_FILE ="dam:scene7File";

	/* Basic Variables */
	private Resource resource;
	private Page currentPage;
	private ValueMap properties;
	private ResourceResolver resourceResolver;
	private boolean author;

	/* Scene7 Variables */
	private String fileReference;
	private String damAssetref;
	private String scene7FileStatus;
	private String scene7FileName;
	private String videoShortDesc;
	private String shortDesc;
	private String videoTitle;
	private String fileFormat;
	private String lastModified;
	private String serverurl;
	private String width = "630";
	private String height = "315";
    private String customThumbnailPath = "";
	private boolean shouldShowDetail;
	private long size;

	public VideoPlayer(Resource resource, Page currentPage, SlingHttpServletRequest slingRequest) {
		this.resource = resource;
		this.currentPage = currentPage;
		this.resourceResolver = resource.getResourceResolver();
		this.properties = resource.adaptTo(ValueMap.class);
		this.author = WCMMode.fromRequest(slingRequest) == WCMMode.EDIT;
		init();
	}

	private void init() {
		try {
			setupVideoFileReference();
			setShouldShowDetail(showDetailOnTemplate());
            setCustomPosterImage();
		} catch (Exception exception) {
			LOGGER.error("Exception for video player caught: ", exception);
		}

	}

	private void setupVideoFileReference() throws PersistenceException, RepositoryException {
		// Get the property from the dialog. Ideally this is a DAM url
		fileReference = properties.get(FILE_REFERENCE, String.class);
		
		if(author) {

		// If file reference is not null
		if (fileReference != null && (fileReference.indexOf("/e2/") != -1 || fileReference.indexOf("/is/image/") != -1)) {

			// To Check whether URL is Scene7 Publish URL or not only first time.
		} else {
			// It will get dam url and store dam url in node. only execute once.
			damAssetref = fileReference;
			if (damAssetref != null) {
				writeToJCR(DAM_SCENE7_FILE, damAssetref);
			}
		}
		if (fileReference != null) { 

			// Get the asset using the file reference
			Asset asset = getAsset();
			if (asset != null) {
				String scene7Url = getAssetScene7URL(asset);
				// If scene 7 url exist and its different from the file
				// reference.
				if (scene7Url != null && !scene7Url.equals(fileReference)) {
					writeToJCR(FILE_REFERENCE, scene7Url);
					writeToJCR(DAM_SCENE7_FILE, damAssetref);
				} // Scene7 URL null or equal to fileReference
			} // generateServerURL(scene7URL);
		}
	}

			// Get the metadata for the video from dam reference
			String assetDamRef = properties.get(DAM_SCENE7_FILE, String.class);
			if (assetDamRef != null) {
					Resource assetResource = resourceResolver.getResource(assetDamRef);
					if (assetResource != null) {
						Asset damAsset = assetResource.adaptTo(Asset.class);
						fetchAssetMetadataValues(damAsset);
						findAssetSize(damAsset);
						getDefaultVideoShortDesc();
					}
			}
		} 
	

	/**
	 * Get Scene7 URL for a given Asset
	 * 
	 * @param asset
	 * @return
	 */
	private String getAssetScene7URL(Asset asset) {
		String scene7Url = null;

		// Get the bundle context to get the Service.
		BundleContext bundleContext = FrameworkUtil.getBundle(Scene7DAMService.class).getBundleContext();

		// Get the service using the bundle context.
		Scene7DAMService s7ds = (Scene7DAMService) bundleContext.getService(bundleContext.getServiceReference(Scene7DAMService.class.getName()));
		if (s7ds != null) {
			// Get the scene7 url for the asset.
			scene7Url = s7ds.getS7FileReference(asset);
		}
		return scene7Url;
	}

	/**
	 * Finds the asset defined in the fileReference variable
	 * 
	 * @return the asset if found. Null if not.
	 */
	private Asset getAsset() {
		Resource assetResource = resourceResolver.getResource(fileReference);
		//Asset videoAsset = assetResource != null ? assetResource.adaptTo(Asset.class) : null;
		return assetResource != null ? assetResource.adaptTo(Asset.class) : null;

	}

	/**
	 * Util method to write properties to JCR.
	 * 
	 * @param key
	 *            : the property key
	 * @param value
	 *            : the property value
	 * @throws PersistenceException
	 */
	private void writeToJCR(String key, String value) throws PersistenceException {
		PersistableValueMap props = resource.adaptTo(PersistableValueMap.class);
		props.put(key, value);
		props.save();
	}

	/**
	 * Gets the needed Metadata for the specified asset.
	 * 
	 * @param asset
	 *            : The Video Asset to get the metadata from.
	 */
	private void fetchAssetMetadataValues(Asset asset) {
		scene7FileStatus = metadataValue(asset, "dam:scene7FileStatus");
		scene7FileName = metadataValue(asset, "dam:scene7File");
		videoShortDesc = metadataValue(asset, "dc:description");
		videoTitle = metadataValue(asset, "dc:title");
		fileFormat = metadataValue(asset, "dc:format");
		lastModified = metadataValue(asset, "dc:modified");
		if (lastModified != null && !"".equals(lastModified)) {
			Format formatter = new SimpleDateFormat("MM/dd/yy");
			lastModified = formatter.format(DateParser.parseDate(lastModified));
		}
	}

	/**
	 * Util Method to get the metadata needed.
	 * 
	 * @param asset
	 *            : The asset to get the metadata from
	 * @param name
	 *            : the name of the metadata value needed.
	 * @return Metadata Value: The value for the specified metadata key. Empty
	 *         String if not found.
	 */
	private String metadataValue(Asset asset, String name) {
		// Check for value being a String Array.
		//String value = !("".equals(asset.getMetadataValue(name))) ? asset.getMetadataValue(name) : "";
		return !("".equals(asset.getMetadataValue(name))) ? asset.getMetadataValue(name) : "";
	}

	/**
	 * Util Method to get the size of the Asset. This is used for UI purposes.
	 * 
	 * @throws RepositoryException
	 */
	private void findAssetSize(Asset asset) throws RepositoryException {

		// Get the resource specified on the file reference variable.
		Rendition original = asset.getOriginal();
		size = original != null ? original.getSize() : 0;
	}

	/**
	 * Util method to generate the Server URL
	 * 
	 * @param reference
	 *            the URL to create the Server URL from. scene7 url either has
	 *            index of either '/e2/' or '/is/image/'
	
	private void generateServerURL(String reference) {
		if (fileReference.indexOf("/e2/") != -1) {
			int idx = fileReference.lastIndexOf("e2", '/');
			serverurl = (idx > 0) ? fileReference.substring(0, idx) : "";
			scene7FileName = (idx > 0) ? fileReference.substring(idx) : "";
			scene7FileName = scene7FileName.replace("e2", "is/image");
		}
		if (fileReference.indexOf("/is/image/") != -1) {
			int idx = fileReference.lastIndexOf("/is/image", '/');
			serverurl = (idx > 0) ? fileReference.substring(0, idx) : "";
			scene7FileName = (idx > 0) ? fileReference.substring(idx) : "";
		}
	} */

	/**
	 * Util method to determine if the template is a media center page.
	 * 
	 * @return boolean value.
	 */
	private boolean showDetailOnTemplate() {
		String template = currentPage.getContentResource().getResourceType();
		return template.contains(MC_TEMPLATE);
	}
	/**
	 * Get the property from the dialog. Ideally this is a Video Descrpition from Brightcove.
	 * 
	 * @return String value.
	 */
	private String getDefaultVideoShortDesc() {
		// Get the property from the dialog. Ideally this is a Video Descrpition from Brightcove.
		shortDesc =properties.get("desc", String.class);
		return shortDesc;
	}


    /**
     * Get the thumbnail from the page properties (for the custom video thumbnail).
     *
     * @return String value.
     */
    private void setCustomPosterImage() {
        // Get the property from the dialog. Ideally this is a Video Descrpition from Brightcove.

        ValueMap imageProps = null;
        String imageFileReference = null;
        Asset image = null;
        Resource parentResource = currentPage.adaptTo(Resource.class);
        // fetch the image resource from the page properties
        Resource imgResource = parentResource.getChild("jcr:content").getChild("thumbnail");

        if(imgResource != null)
        {
            imageProps = imgResource.adaptTo(ValueMap.class);

            if(imageProps!=null && null != imageProps.get("fileReference"))
            {
                imageFileReference = imageProps.get("fileReference").toString();

                image = resourceResolver.getResource(imageFileReference).adaptTo(Asset.class);

            }

            // use scene 7 path if image has been published to scene 7
            if(image!=null && null != image.getMetadataValue("dam:scene7File"))
            {
                customThumbnailPath = image.getMetadataValue("dam:scene7File").toString();
            }
        }

        if(customThumbnailPath == null)
        {
            customThumbnailPath =  "";
        }

    }

	/*
	 * ========================== Getters And Setters ==========================
	 */

	public String getFileReference() {
		return fileReference;
	}

	public void setFileReference(String fileReference) {
		this.fileReference = fileReference;
	}

	public String getScene7FileName() {
		return scene7FileName;
	}

	public void setScene7FileName(String scene7FileName) {
		this.scene7FileName = scene7FileName;
	}

	public String getScene7FileStatus() {
		return scene7FileStatus;
	}

	public void setScene7FileStatus(String scene7FileStatus) {
		this.scene7FileStatus = scene7FileStatus;
	}

	public String getVideoShortDesc() {
		return videoShortDesc;
	}

	public void setVideoShortDesc(String videoShortDesc) {
		this.videoShortDesc = videoShortDesc;
	}

	public String getVideoTitle() {
		return videoTitle;
	}

	public void setVideoTitle(String videoTitle) {
		this.videoTitle = videoTitle;
	}

	public String getFileFormat() {
		return fileFormat;
	}

	public void setFileFormat(String fileFormat) {
		this.fileFormat = fileFormat;
	}

	public String getLastModified() {
		return lastModified;
	}

	public void setLastModified(String lastModified) {
		this.lastModified = lastModified;
	}

	public String getSize() {
		return UIHelper.getSizeLabel(size);
	}

	public void setSize(long size) {
		this.size = size;
	}

	public boolean isAuthor() {
		return author;
	}

	public void setAuthor(boolean author) {
		this.author = author;
	}

	public boolean isShouldShowDetail() {
		return shouldShowDetail;
	}

	public void setShouldShowDetail(boolean shouldShowDetail) {
		this.shouldShowDetail = shouldShowDetail;
	}

	public String getServerurl() {
		return serverurl;
	}

	public void setServerurl(String serverurl) {
		this.serverurl = serverurl;
	}

	public String getWidth() {
		return width;
	}

	public void setWidth(String width) {
		this.width = width;
	}

	public String getHeight() {
		return height;
	}

	public void setHeight(String height) {
		this.height = height;
	}
	public String getShortDesc() {
		return shortDesc;
	}

	public void setShortDesc(String shortDesc) {
		this.shortDesc = shortDesc;
	}

    public String getCustomThumbnailPath() {
        return customThumbnailPath;
    }

    public void setCustomThumbnailPath(String customThumbnailPath) {
        this.customThumbnailPath = customThumbnailPath;
    }


}
