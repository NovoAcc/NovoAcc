/*
 * ***********************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2011 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 * ***********************************************************************
 */

package libs.cq.personalization.components.clientcontext.command.thumbnail;

import com.day.cq.commons.ImageHelper;
import com.day.cq.commons.ImageResource;
import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.wcm.commons.AbstractImageServlet;
import com.day.cq.wcm.commons.RequestHelper;
import com.day.cq.wcm.foundation.Image;
import com.day.image.Layer;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.HttpConstants;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.io.IOException;
import java.util.Calendar;


//TODO: move to a proper place
/**
 * Renders an image.
 */
public class png extends AbstractImageServlet {

    protected Layer createLayer(ImageContext c)
            throws RepositoryException, IOException {
        // don't create the later yet. handle everything later
        return null;
    }

    protected void writeLayer(SlingHttpServletRequest req,
                              SlingHttpServletResponse resp,
                              ImageContext c, Layer layer)
            throws IOException, RepositoryException {

        String path = req.getParameter("path");
        if (path == null) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing path parameter.");
            return;
        }

        //check if path starts by context path
        if( path.indexOf(req.getContextPath()) == 0) {
            //remove it
            path = path.substring(req.getContextPath().length(),path.length());
        }

        Resource imgRes = req.getResourceResolver().resolve(req, path);
        if (imgRes == null) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Unknown resource.");
            return;
        }

        Image image = new Image(imgRes);
        if( !image.hasContent()) {
            Resource rendition = req.getResourceResolver().getResource(path + "/jcr:content/renditions/original");
            if( rendition != null ) {
                image = new Image(rendition);
            }
        }

        image.setItemName(Image.NN_FILE, "jcr:content");
        image.setItemName(Image.PN_IMAGE_ROTATE, "rotate");
        image.setItemName(Image.PN_IMAGE_CROP, "crop");
        image.setItemName(Image.PN_REFERENCE, "reference");

        layer= GfxHelper.stampThumbnail(image);
        if (layer == null) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Layer not found");
            return;
        }

        Calendar lastMod = c.properties.get(JcrConstants.JCR_LASTMODIFIED, Calendar.class);
        if (lastMod != null) {
            resp.setDateHeader(HttpConstants.HEADER_LAST_MODIFIED, lastMod.getTimeInMillis());
        }
        resp.setContentType("image/png");
        layer.write("image/png", 1.0, resp.getOutputStream());
        resp.flushBuffer();
    }

    @Override
    protected boolean checkModifiedSince(SlingHttpServletRequest req, SlingHttpServletResponse resp) {
        String path = req.getParameter("path");
        if (path == null) {
            try {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing path parameter.");
            } catch (IOException e) {}
            return false;
        }

        Resource imgRes = req.getResourceResolver().resolve(req, path);
        if (imgRes == null) {
            try {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Unknown resource.");
            } catch (IOException e) {}
            return false;
        }

        Node node = imgRes.adaptTo(Node.class);
        if( node != null ) {
            try {
                if (node.hasNode("thumbnail")) {
                    node = node.getNode("thumbnail");
                }
            } catch (RepositoryException e) {
                // ignore
            }
            return RequestHelper.handleIfModifiedSince(req, resp, node);
        }

        return false;
    }
}

//TODO: move to a proper place

class GfxHelper {
    //TODO: move to resources
    public static String GFX_MASK_ALPHA_PATH = "/etc/clientcontext/shared/thumbnail/resources/mask.gif";
    public static String GFX_MASK_GLARE_PATH = "/etc/clientcontext/shared/thumbnail/resources/mask.png";

    public static Layer stampThumbnail(ImageResource image) throws IOException, RepositoryException {
        if (!image.hasContent()) {
            return null;
        }

        // get pure layer
        Layer layer = image.getLayer(false, false, false);

        // crop
        image.crop(layer);

        // resize
        int w = layer.getWidth();
        int h = layer.getHeight();
        if (h < w) {
            image.set(ImageResource.PN_HEIGHT, "80");
        } else {
            image.set(ImageResource.PN_WIDTH, "80");
        }
        image.resize(layer);

        // crop again
        layer.crop(new Rectangle(0, 0, 80, 80));

        // rotate
        image.rotate(layer);

        Session s = image.getResourceResolver().adaptTo(Session.class);

        // merge alpha channel with layer mask
        Layer alpha = ImageHelper.createLayer(s, GFX_MASK_ALPHA_PATH);
        Layer alpha2 = new Layer(layer.getWidth(), layer.getHeight(), Color.WHITE);
        alpha2.copyChannel(layer, Layer.ALPHA_CHANNEL_ID, Layer.RED_CHANNEL_ID);
        alpha2.copyChannel(alpha, Layer.RED_CHANNEL_ID, Layer.ALPHA_CHANNEL_ID);
        alpha2.flatten(Color.BLACK);

        // apply new alpha channel to layer
        layer.copyChannel(alpha2, Layer.RED_CHANNEL_ID, Layer.ALPHA_CHANNEL_ID);

        // and merge with 'glare' image
        Layer mask = ImageHelper.createLayer(s, GFX_MASK_GLARE_PATH);
        layer.merge(mask);
        return layer;
    }

    public static Layer stampScreenshot(ImageResource image)
            throws IOException, RepositoryException {
        return stampScreenshot(image, false);
    }

    public static Layer stampScreenshot(ImageResource image, boolean notNull)
            throws IOException, RepositoryException {
        if (!image.hasContent()) {
            return null;
        }

        // get pure layer
        Layer layer = image.getLayer(false, false, false);
        boolean modified = false;

        if (layer != null) {
            // crop
            modified = image.crop(layer) != null;

            // resize
            modified |= image.resize(layer) != null;

            // rotate
            modified |= image.rotate(layer) != null;

        }

        if (modified || notNull) {
            return layer;
        } else {
            return null;
        }
    }

}